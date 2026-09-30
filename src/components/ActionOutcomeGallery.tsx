import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { SceneNavigator } from "./SceneNavigator";

const scenes = [
  { id: "gravel", label: "Demo 01 · Gravel", title: "Gravel or dirt?", route: "Gravel route", assetSuffix: "" },
  { id: "mud", label: "Demo 02 · Mud", title: "Mud or dirt?", route: "Mud route", assetSuffix: "-v2" },
] as const;

function waitUntilReady(video: HTMLVideoElement, signal: AbortSignal) {
  if (signal.aborted) return Promise.reject(new Error("Cancelled"));
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("canplay", ready);
      video.removeEventListener("error", failed);
      signal.removeEventListener("abort", cancelled);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video could not load")); };
    const cancelled = () => { cleanup(); reject(new Error("Cancelled")); };
    const timeout = window.setTimeout(failed, 30000);
    video.addEventListener("canplay", ready, { once: true });
    video.addEventListener("error", failed, { once: true });
    signal.addEventListener("abort", cancelled, { once: true });
    video.preload = "auto";
    video.load();
  });
}

function ActionScene({ scene, direction }: { scene: (typeof scenes)[number]; direction: -1 | 1 }) {
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const request = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const base = `./videos/action-outcomes/${scene.id}`;

  useEffect(() => {
    const mountedVideos = videos.current.filter((video): video is HTMLVideoElement => video !== null);
    return () => {
      request.current += 1;
      pending.current?.abort();
      mountedVideos.forEach((video) => video.pause());
    };
  }, []);

  function updatePlaybackState() {
    setPlaying(videos.current.some((video) => video && !video.paused && !video.ended));
  }

  function pauseBoth() {
    request.current += 1;
    pending.current?.abort();
    videos.current.forEach((video) => video?.pause());
    setPlaying(false);
    setLoading(false);
  }

  async function playBoth(restart = false) {
    const current = videos.current.filter((video): video is HTMLVideoElement => video !== null);
    if (current.length !== 2) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    const token = ++request.current;
    const resumeAt = restart || current.some((video) => video.ended)
      ? 0 : Math.min(...current.map((video) => video.currentTime));
    current.forEach((video) => video.pause());
    setLoading(true);
    setError("");
    try {
      await Promise.all(current.map((video) => waitUntilReady(video, controller.signal)));
      if (token !== request.current) return;
      current.forEach((video) => { video.currentTime = resumeAt; });
      const started = await Promise.allSettled(current.map((video) => video.play()));
      if (token !== request.current) {
        current.forEach((video) => video.pause());
        return;
      }
      if (started.some((result) => result.status === "rejected")) throw new Error("Playback blocked");
      setPlaying(true);
    } catch {
      if (token !== request.current) return;
      current.forEach((video) => video.pause());
      setPlaying(false);
      setError("A video could not start. Try again or use the individual video controls.");
    } finally {
      if (token === request.current) {
        setLoading(false);
        pending.current = null;
        controller.abort();
      }
    }
  }

  return (
    <section
      id="action-demo-panel"
      role="tabpanel"
      aria-labelledby={`action-demo-panel-tab-${scene.id}`}
      className={`action-outcome-panel demo-panel-${direction > 0 ? "forward" : "backward"}`}
    >
      <div className="terrain-row-heading">
        <h3><span>{scene.label}</span>{scene.title}</h3>
        <div className="terrain-row-controls" aria-label={`${scene.title} playback`}>
          <button type="button" className="terrain-play-button" onClick={() => playing || loading ? pauseBoth() : void playBoth()}>
            {loading ? <Loader2 size={16} className="action-loading-icon" aria-hidden="true" /> : playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {loading ? "Cancel loading" : playing ? "Pause both" : "Play both actions"}
          </button>
          <button type="button" className="terrain-replay-button" onClick={() => void playBoth(true)} disabled={loading} aria-label={`Replay both actions in ${scene.title}`}>
            <RotateCcw size={16} aria-hidden="true" />Replay
          </button>
        </div>
      </div>

      <div className="action-video-scroll" tabIndex={0} role="group" aria-label="Two action consequences. Scroll horizontally on a small screen.">
        <div className="action-video-grid">
          {[scene.route, "Dirt route"].map((route, index) => {
            const path = `${base}-action-${index + 1}${scene.assetSuffix}`;
            return (
              <figure key={route}>
                <figcaption><span className="action-number">Action 0{index + 1}</span><strong>{route}</strong></figcaption>
                <video
                  ref={(element) => { videos.current[index] = element; }}
                  src={`${path}.mp4`}
                  poster={`${path}.webp`}
                  width={1280}
                  height={720}
                  controls
                  muted
                  playsInline
                  preload="none"
                  aria-label={`${scene.title}: predicted consequence of taking the ${route.toLowerCase()}.`}
                  onPlay={updatePlaybackState}
                  onPause={updatePlaybackState}
                  onEnded={updatePlaybackState}
                  onError={() => setError("A video could not load. Please try again.")}
                >
                  <a href={`${path}.mp4`}>Download this video</a>
                </video>
              </figure>
            );
          })}
        </div>
      </div>
      <p className="action-swipe-hint">Swipe horizontally to compare both actions.</p>
      {error && <p className="terrain-video-error" role="status">{error}</p>}
    </section>
  );
}

export function ActionOutcomeGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const scene = scenes[activeIndex] ?? scenes[0];

  return (
    <div className="action-outcome-gallery">
      <SceneNavigator
        items={scenes}
        activeIndex={activeIndex}
        label="Choose an action-selection demo"
        panelId="action-demo-panel"
        onSelect={(index, nextDirection) => { setDirection(nextDirection); setActiveIndex(index); }}
      />
      <div className="demo-panel-viewport">
        <ActionScene key={scene.id} scene={scene} direction={direction} />
      </div>
    </div>
  );
}
