"""One-time migration of public demo media with exact byte verification."""

import concurrent.futures
import hashlib
import json
import pathlib
import time
import urllib.request


manifest = json.loads(pathlib.Path("media-migration.json").read_text())


def matches(path, record):
    if not path.is_file() or path.stat().st_size != record["size"]:
        return False
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest() == record["sha256"]


def migrate(record):
    path = pathlib.Path(record["path"])
    if not record["path"].startswith("public/videos/") or ".." in path.parts:
        raise ValueError("Unexpected media path")
    if matches(path, record):
        return str(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".download")
    url = manifest["source_base"] + path.as_posix().removeprefix("public/")
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "DR-WM-media-migration/1.0"})
            with urllib.request.urlopen(request, timeout=60) as response, temporary.open("wb") as stream:
                for chunk in iter(lambda: response.read(1024 * 1024), b""):
                    stream.write(chunk)
            if not matches(temporary, record):
                raise ValueError("Media bytes did not match the prepared migration copy: " + str(path))
            temporary.replace(path)
            return str(path)
        except Exception:
            temporary.unlink(missing_ok=True)
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    for path in executor.map(migrate, manifest["files"]):
        print("Verified", path, flush=True)

print("Verified all", len(manifest["files"]), "media files", flush=True)
