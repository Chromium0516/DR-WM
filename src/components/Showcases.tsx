import { useState } from "react";
import { terrains, type TerrainId, comparisonVideos } from "@/content/site";
import { FigureModal } from "@/components/FigureModal";
import cosmosImage from "@/assets/comparison-cosmos.webp";
import lingbotImage from "@/assets/comparison-lingbot.webp";
import drwmImage from "@/assets/comparison-drwm.webp";
import fullComparison from "@/assets/snow-comparison.webp";

const media = import.meta.glob<string>("../assets/terrain-*.webp", { eager: true, query: "?url", import: "default" });
const order: TerrainId[] = ["normal", "mud", "cobblestone", "snow"];
const labels: Record<TerrainId, string> = { normal: "Normal", mud: "Mud", cobblestone: "Cobblestone", snow: "Snow" };
const outcomes: Record<TerrainId, [string, string]> = {
  normal: ["Normal terrain", "Stable forward motion"],
  mud: ["Low stiffness", "Heavier, sinking steps"],
  cobblestone: ["High roughness", "Bumpy, uneven motion"],
  snow: ["Low friction", "Visible slippage"],
};

function frameUrl(terrain: TerrainId, frame: number) {
  const suffix = frame === 0 ? "input" : "future-" + frame;
  const url = media["../assets/terrain-" + terrain + "-" + suffix + ".webp"];
  if (!url) throw new Error("Missing paper frame: " + terrain + " / " + frame);
  return url;
}

function Media({ src, alt, videoUrl, ours }: { src: string; alt: string; videoUrl?: string | null; ours?: boolean }) {
  return (
    <div className={"showcase-media" + (ours ? " ours-media" : "")}>
      {videoUrl ? (
        <video src={videoUrl} poster={src} controls playsInline preload="metadata" />
      ) : (
        <><img src={src} alt={alt} loading="lazy" decoding="async" /><span className="still-badge">Paper frame</span></>
      )}
    </div>
  );
}

export function TerrainShowcase() {
  const [active, setActive] = useState<TerrainId>("snow");
  const [frame, setFrame] = useState(4);
  const current = terrains.find((t) => t.id === active)!;
  const [property, effect] = outcomes[active];
  return (
    <div className="terrain-showcase">
      <fieldset className="terrain-picker">
        <legend className="sr-only">Choose a terrain</legend>
        {order.map((id) => (
          <label key={id} className={"terrain-option" + (id === active ? " selected" : "")}>
            <input className="sr-only" type="radio" name="terrain" checked={active === id} onChange={() => { setActive(id); setFrame(4); }} />
            <img src={frameUrl(id, 0)} alt="" loading="lazy" />
            <span>{labels[id]}</span>
          </label>
        ))}
      </fieldset>
      <div className="observation-pair">
        <figure className="input-observation">
          <figcaption>Initial Observation</figcaption>
          <div className="showcase-media input-media"><img src={frameUrl(active, 0)} alt={"Initial RGB observation of " + labels[active].toLowerCase() + " terrain."} loading="lazy" /></div>
          <p className="input-caption">Initial RGB + robot state + recorded actions</p>
        </figure>
        <figure className="predicted-observation">
          <figcaption className="ours-label">DR-WM Prediction</figcaption>
          <Media src={frameUrl(active, frame)} alt={"Predicted future frame " + frame + " on " + labels[active].toLowerCase() + " terrain."} videoUrl={current.videoUrl} ours />
          {!current.videoUrl && (
            <div className="frame-picker" aria-label="Predicted paper frames">
              {[1, 2, 3, 4].map((n) => (
                <button type="button" className={frame === n ? "selected" : ""} aria-pressed={frame === n} key={n} onClick={() => setFrame(n)}>
                  <img src={frameUrl(active, n)} alt="" loading="lazy" /><span>Frame {n}</span>
                </button>
              ))}
            </div>
          )}
        </figure>
      </div>
      <p className="outcome-caption" aria-live="polite"><span>{property}</span><span className="outcome-arrow" aria-hidden="true">→</span><strong>{effect}</strong></p>
    </div>
  );
}

export function ComparisonShowcase() {
  const [baseline, setBaseline] = useState<"cosmos" | "lingbot">("cosmos");
  const label = baseline === "cosmos" ? "Cosmos 3" : "LingBot-World";
  const image = baseline === "cosmos" ? cosmosImage : lingbotImage;
  return (
    <div>
      <fieldset className="baseline-picker">
        <legend className="sr-only">Comparison baseline</legend>
        {(["cosmos", "lingbot"] as const).map((id) => (
          <label key={id} className={baseline === id ? "selected" : ""}>
            <input className="sr-only" type="radio" name="baseline" checked={baseline === id} onChange={() => setBaseline(id)} />
            Ours vs {id === "cosmos" ? "Cosmos 3" : "LingBot-World"}
          </label>
        ))}
      </fieldset>
      <div className="observation-pair comparison-pair">
        <figure><figcaption className="ours-label">DR-WM (Ours)</figcaption><Media src={drwmImage} alt="DR-WM future observation under low-friction snowy terrain." videoUrl={comparisonVideos.drwm} ours /><p className="comparison-caption">Motion predicted through terrain physics</p></figure>
        <figure><figcaption>{label}</figcaption><Media src={image} alt={label + " future observation on the same snowy uphill scene."} videoUrl={comparisonVideos[baseline]} /><p className="comparison-caption">Measured future-motion conditioning</p></figure>
      </div>
      <p className="conditioning-note">Baselines receive measured future motion in their native interfaces.<br />DR-WM receives recorded controls and predicts robot–camera motion through Genesis.</p>
      <details className="comparison-details">
        <summary>View the full comparison and trajectories</summary>
        <FigureModal src={fullComparison} title="Snowy uphill comparison and bird’s-eye trajectories" alt="Full Figure 3: Cosmos 3, LingBot-World and DR-WM frame sequences, physical priors, and bird’s-eye trajectories." className="comparison-full-figure" />
      </details>
    </div>
  );
}
