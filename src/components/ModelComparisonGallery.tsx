import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { SceneNavigator } from "./SceneNavigator";

type ComparisonMethod = {
  id: "cosmos-3" | "lingbot-world" | "drwm" | "trajectory-bev";
  label: string;
  ours?: boolean;
  trajectory?: boolean;
};

const methods: readonly ComparisonMethod[] = [
  { id: "cosmos-3", label: "Cosmos 3" },
  { id: "lingbot-world", label: "LingBot-World" },
  { id: "drwm", label: "DR-WM", ours: true },
  { id: "trajectory-bev", label: "Trajectory (Bird’s-eye View)", trajectory: true },
];

const scenes = [
  { id: "demo2", label: "Demo 01", title: "Evaluation Scene 01" },
  { id: "demo3", label: "Demo 02", title: "Evaluation Scene 02" },
  { id: "demo4", label: "Demo 03", title: "Evaluation Scene 03" },
  { id: "demo5", label: "Demo 04", title: "Evaluation Scene 04" },
  { id: "demo6", label: "Demo 05", title: "Evaluation Scene 05" },
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

function ComparisonRow({ scene, direction }: { scene: (typeof scenes)[number]; direction: -1 | 1 }) {
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const request = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sceneLabel = scene.title;

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
    if (!current.length) return;
    const token = ++request.current;
    const resumeAt = restart || current.some((video) => video.ended)
      ? 0
      : Math.min(...current.map((video) => video.currentTime));

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
      id="comparison-demo-panel"
      role="tabpanel"
      className={`model-comparison-row demo-panel demo-panel-${direction > 0 ? "forward" : "backward"}`}
      aria-labelledby={`comparison-demo-panel-tab-${scene.id}`}
    >
      <div className="model-row-heading">
        <h3>{sceneLabel}</h3>
        <div className="model-row-controls" aria-label={`${sceneLabel} playback`}>
          <button type="button" className="model-play-button" onClick={() => playing ? pauseAll() : void playAll()} disabled={loading}>
            {loading ? <Loader2 size={16} aria-hidden="true" /> : playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {loading ? "Loading…" : playing ? "Pause all" : "Play all four"}
          </button>
          <button type="button" className="model-replay-button" onClick={() => void playAll(true)} disabled={loading} aria-label={`Replay all four videos in ${sceneLabel}`}>
            <RotateCcw size={16} aria-hidden="true" />Replay
          </button>
        </div>
      </div>
      <div className="model-comparison-scroll" tabIndex={0} role="group" aria-label={`${sceneLabel}: three world models and the paired bird’s-eye trajectory. Scroll horizontally on a small screen.`}>
        <div className="model-comparison-grid">
          {methods.map((method, methodIndex) => {
            const path = `./videos/model-comparisons/${scene.id}-${method.id}`;
            return (
              <figure key={method.id} className={`model-video-card${method.ours ? " ours" : ""}${method.trajectory ? " trajectory" : ""}`}>
                <figcaption>
                  <span>{method.label}</span>
                  {method.ours && <span className="model-ours-chip">Ours</span>}
                </figcaption>
                <video
                  ref={(element) => { videos.current[methodIndex] = element; }}
                  src={`${path}.mp4`}
                  poster={`${path}.webp`}
                  controls
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={`${sceneLabel}: ${method.label}`}
                  onPlay={updatePlaybackState}
                  onPause={updatePlaybackState}
                  onEnded={updatePlaybackState}
                >
                  <a href={`${path}.mp4`}>Download this video</a>
                </video>
              </figure>
            );
          })}
        </div>
      </div>
      {error && <p className="model-video-error" role="status">{error}</p>}
    </section>
  );
}

export function ModelComparisonGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const scene = scenes[activeIndex] ?? scenes[0];

  function selectScene(index: number, nextDirection: -1 | 1) {
    setDirection(nextDirection);
    setActiveIndex(index);
  }

  return (
    <div className="model-comparison-gallery">
      <SceneNavigator
        items={scenes}
        activeIndex={activeIndex}
        label="Choose a model-comparison demo"
        panelId="comparison-demo-panel"
        onSelect={selectScene}
      />
      <p className="comparison-swipe-hint">Swipe horizontally to compare all four views.</p>
      <div className="demo-panel-viewport">
        <ComparisonRow key={scene.id} scene={scene} direction={direction} />
      </div>
      <p className="comparison-horizon-note">All panels cover the same 8-second horizon. Source frame rates are preserved.</p>
    </div>
  );
}
