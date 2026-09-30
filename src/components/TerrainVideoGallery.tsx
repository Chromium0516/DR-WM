import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { SceneNavigator } from "./SceneNavigator";

const terrains = [
  { id: "normal", label: "Original terrain" },
  { id: "mud", label: "Mud" },
  { id: "cobblestone", label: "Cobblestone" },
  { id: "snow", label: "Snow" },
] as const;

const scenes = [
  { id: "demo1", label: "Demo 01", title: "Stone-walled lane" },
  { id: "demo2", label: "Demo 02", title: "Tree-lined road" },
  { id: "demo3", label: "Demo 03", title: "Residential junction" },
  { id: "demo4", label: "Demo 04", title: "Woodland road" },
] as const;

function waitUntilReady(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("canplay", ready);
      video.removeEventListener("error", failed);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video could not load")); };
    const timeout = window.setTimeout(failed, 30000);
    video.addEventListener("canplay", ready, { once: true });
    video.addEventListener("error", failed, { once: true });
    video.preload = "auto";
    video.load();
  });
}

function TerrainSceneRow({ scene, direction }: { scene: (typeof scenes)[number]; direction: -1 | 1 }) {
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const request = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    request.current += 1;
    videos.current.forEach((video) => video?.pause());
  }, []);

  function updatePlaybackState() {
    setPlaying(videos.current.some((video) => video && !video.paused && !video.ended));
  }

  function pauseAll() {
    request.current += 1;
    videos.current.forEach((video) => video?.pause());
    setPlaying(false);
    setLoading(false);
  }

  async function playAll(restart = false) {
    const current = videos.current.filter((video): video is HTMLVideoElement => video !== null);
    const token = ++request.current;
    const resumeAt = restart || current.some((video) => video.ended)
      ? 0 : Math.min(...current.map((video) => video.currentTime));
    current.forEach((video) => video.pause());
    setLoading(true);
    setError("");
    try {
      await Promise.all(current.map(waitUntilReady));
      if (token !== request.current) return;
      current.forEach((video) => { video.currentTime = resumeAt; });
      const started = await Promise.allSettled(current.map((video) => video.play()));
      if (token !== request.current) return;
      if (started.some((result) => result.status === "rejected")) throw new Error("Playback blocked");
      setPlaying(true);
    } catch {
      if (token !== request.current) return;
      current.forEach((video) => video.pause());
      setPlaying(false);
      setError("One video could not start. Try again or use the individual video controls.");
    } finally {
      if (token === request.current) setLoading(false);
    }
  }

  return (
    <section
      id="terrain-demo-panel"
      role="tabpanel"
      className={`terrain-video-row demo-panel demo-panel-${direction > 0 ? "forward" : "backward"}`}
      aria-labelledby={`terrain-demo-panel-tab-${scene.id}`}
    >
      <div className="terrain-row-heading">
        <h3 id={scene.id + "-title"}><span>{scene.label}</span>{scene.title}</h3>
        <div className="terrain-row-controls" aria-label={scene.label + " playback"}>
          <button type="button" className="terrain-play-button" onClick={() => playing ? pauseAll() : void playAll()} disabled={loading}>
            {loading ? <Loader2 size={16} aria-hidden="true" /> : playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {loading ? "Loading…" : playing ? "Pause all" : "Play all four"}
          </button>
          <button type="button" className="terrain-replay-button" onClick={() => void playAll(true)} disabled={loading} aria-label={"Replay all four videos in " + scene.label}>
            <RotateCcw size={16} aria-hidden="true" />Replay
          </button>
        </div>
      </div>
      <div className="terrain-video-scroll" tabIndex={0} role="group" aria-label={scene.label + ": four terrain videos. Scroll horizontally on a small screen."}>
        <div className="terrain-video-grid">
          {terrains.map((terrain, index) => {
            const path = "./videos/terrain-scenes/" + scene.id + "-" + terrain.id;
            return (
              <figure key={terrain.id}>
                <figcaption>{terrain.label}</figcaption>
                <video
                  ref={(element) => { videos.current[index] = element; }}
                  src={path + ".mp4"}
                  poster={path + ".webp"}
                  width={1280}
                  height={704}
                  controls
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={scene.title + ": DR-WM prediction on " + terrain.label.toLowerCase()}
                  onPlay={updatePlaybackState}
                  onPause={updatePlaybackState}
                  onEnded={updatePlaybackState}
                >
                  <a href={path + ".mp4"}>Download this video</a>
                </video>
              </figure>
            );
          })}
        </div>
      </div>
      {error && <p className="terrain-video-error" role="status">{error}</p>}
    </section>
  );
}

export function TerrainVideoGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const scene = scenes[activeIndex] ?? scenes[0];

  function selectScene(index: number, nextDirection: -1 | 1) {
    setDirection(nextDirection);
    setActiveIndex(index);
  }

  return (
    <div className="terrain-video-gallery">
      <SceneNavigator
        items={scenes}
        activeIndex={activeIndex}
        label="Choose a terrain demo"
        panelId="terrain-demo-panel"
        onSelect={selectScene}
      />
      <p className="terrain-swipe-hint">Swipe horizontally to compare all four terrains.</p>
      <div className="demo-panel-viewport">
        <TerrainSceneRow key={scene.id} scene={scene} direction={direction} />
      </div>
    </div>
  );
}
