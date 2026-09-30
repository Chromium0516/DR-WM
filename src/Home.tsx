import { FileText, Code2, Database, BookOpen } from "lucide-react";
import { FigureModal } from "@/components/FigureModal";
import { TerrainVideoGallery } from "@/components/TerrainVideoGallery";
import { ModelComparisonGallery } from "@/components/ModelComparisonGallery";
import { ActionOutcomeGallery } from "@/components/ActionOutcomeGallery";
import { ResultTables } from "@/components/ResultTables";
import { authors, resources } from "@/content/site";
import snowHero from "@/assets/low-friction-snow.jpeg";
import grassHero from "@/assets/normal-friction-grass.jpeg";
import overview from "@/assets/drwm-overview.webp";
import dataset from "@/assets/robot-dataset.webp";

const icons = { paper: FileText, supplementary: BookOpen, code: Code2, dataset: Database };

function Resources() {
  return (
    <div className="publication-resources">
      {resources.map((r) => {
        const Icon = icons[r.id as keyof typeof icons] || FileText;
        const label = r.id === "paper" ? "Paper" : r.label;
        return r.url ? (
          <a key={r.id} href={r.url} className="resource-pill"><Icon size={17} aria-hidden="true" />{label}</a>
        ) : (
          <button key={r.id} className="resource-pill" type="button" disabled title={label + " — coming soon"}>
            <Icon size={17} aria-hidden="true" />{label}<span className="sr-only">: coming soon</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <div className="publication-page">
      <a className="skip-link" href="#results">Skip to results</a>
      <header className="publication-header">
        <h1><span className="project-name">DR-WM:</span> From Pixels to<br className="title-break" /> Executable Physics</h1>
        <p className="publication-subtitle">Behavior-Grounded World Models for<br className="subtitle-break" /> Embodied Action Consequence Prediction</p>
        <p className="publication-authors">{authors}</p>
        <p className="publication-status">Paper under double-blind review</p>
        <Resources />
        <p className="resource-status">Resources coming soon</p>
      </header>

      <main>
        <section className="teaser-section display-width" aria-labelledby="teaser-title">
          <h2 id="teaser-title">Same action. <span>Different physics.</span> Different consequences.</h2>
          <div className="teaser-pair">
            <figure>
              <img src={snowHero} width="1024" height="420" alt="Successive robot positions on snow illustrate slipping under low friction." fetchPriority="high" />
              <figcaption><strong>Low friction</strong><span>Noticeable slippage</span></figcaption>
            </figure>
            <figure>
              <img src={grassHero} width="1022" height="427" alt="Successive robot positions on grass illustrate stable locomotion under normal friction." fetchPriority="high" />
              <figcaption><strong>Normal friction</strong><span>Stable locomotion</span></figcaption>
            </figure>
          </div>
          <p className="teaser-caption"><strong>DR-WM</strong> predicts how robot actions play out through terrain physics,<br className="desktop-break" /> and what the robot sees next.</p>
        </section>

        <section id="results" className="showcase-section video-display-width" aria-labelledby="futures-title">
          <h2 id="futures-title">Action-Conditioned Robot Futures</h2>
          <p className="section-intro">Four scenes. Four terrain conditions.<br />Compare DR-WM predictions across original terrain, mud, cobblestone, and snow.</p>
          <TerrainVideoGallery />
        </section>

        <section className="showcase-section comparison-section" aria-labelledby="comparison-title">
          <div className="video-display-width">
            <h2 id="comparison-title">Comparisons with Video World Models</h2>
            <p className="section-intro">Five evaluation scenes compare future observations from Cosmos 3, LingBot-World, and DR-WM.<br />Play each row to inspect the paired bird’s-eye trajectory.</p>
            <ModelComparisonGallery />
          </div>
        </section>

        <section id="action-selection" className="showcase-section action-selection-section video-display-width" aria-labelledby="action-selection-title">
          <h2 id="action-selection-title">Action Selection through Predicted Consequences</h2>
          <p className="section-intro">Same map. Two candidate actions.<br />Compare the predicted consequences of taking the gravel or mud route versus the dirt route.</p>
          <ActionOutcomeGallery />
        </section>

        <section className="showcase-section dataset-section display-width" aria-labelledby="dataset-title">
          <h2 id="dataset-title">Real Robots. Diverse Terrains.</h2>
          <p className="section-intro">From snow and gravel to grass and indoor floors.</p>
          <FigureModal src={dataset} title="Real-robot data collection" alt="M20 and Lite3 robot data collection across snow, shallow water, rubble, grass, gravel, and indoor surfaces." className="dataset-figure" />
          <p className="media-caption">DEEP Robotics M20 &amp; Lite3 · Synchronized RGB, LiDAR, actions and robot responses</p>
        </section>

        <section className="reading-section abstract-section" aria-labelledby="abstract-title">
          <div className="reading-width">
            <h2 id="abstract-title">Abstract</h2>
            <p>Visual world models can generate plausible futures while bypassing the physical consequences that connect robot actions to motion. <strong>DR-WM</strong> turns visual observations into behavior-grounded executable physics. It reconstructs geometry and spatial priors for friction, roughness and stiffness, calibrated through real action–response data. Given the robot state and recorded commands, Genesis predicts robot motion and the resulting camera trajectory. A geometry-controlled Spatia/Wan model then generates future observations, which update the next physical reconstruction. Only the initial real RGB frame provides visual conditioning. Experiments on held-out scenes support spatial physical priors for improved motion prediction and action-conditioned future-observation generation.</p>
          </div>
        </section>

        <section className="reading-section approach-section display-width" aria-labelledby="approach-title">
          <h2 id="approach-title">Approach</h2>
          <FigureModal src={overview} title="DR-WM: from pixels to executable physics" alt="DR-WM overview: observations become an executable physical map, actions cause robot and camera motion in Genesis, and the generated future observations update the next reconstruction." className="approach-figure" />
          <p className="approach-caption"><strong>Reconstruct. Simulate. Generate. Repeat.</strong> PhyMap builds a geometry-aligned physical field; Genesis converts actions into robot and camera motion; the video model generates the resulting observations. Generated frames feed the next reconstruction.</p>
          <p className="method-note">Physical channels are behavior-grounded simulator priors. The rollout uses recorded actions; it does not perform autonomous replanning.</p>
        </section>

        <section className="quantitative-section display-width">
          <details className="paper-details">
            <summary>Quantitative Results</summary>
            <div className="details-body"><ResultTables /></div>
          </details>
        </section>
      </main>
      <footer className="publication-footer">
        <p>DR-WM · From Pixels to Executable Physics</p>
        <p className="footer-note">Research videos and figures from the manuscript and supplementary material.</p>
        <p className="footer-credit">Presentation inspired by <a href="https://kyleleey.github.io/WonderPlay/" target="_blank" rel="noreferrer">WonderPlay</a>.</p>
      </footer>
    </div>
  );
}
