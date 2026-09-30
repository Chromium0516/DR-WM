/**
 * DR-WM research homepage content configuration.
 *
 * EDIT THIS FILE to publish real resources. Set a `url` to turn a pending
 * "Coming soon" control into a real link. Leave it `null` to keep it disabled.
 */

export type Resource = {
  id: string;
  label: string;
  /** Set to a real URL to enable the control. `null` keeps it disabled. */
  url: string | null;
  note: string;
};

export const resources: Resource[] = [
  { id: "paper", label: "Paper (PDF)", url: null, note: "Coming soon" },
  { id: "supplementary", label: "Supplementary", url: null, note: "Coming soon" },
  { id: "code", label: "Code", url: null, note: "Coming soon" },
  { id: "dataset", label: "Dataset", url: null, note: "Coming soon" },
];

/** Anonymized manuscript: do not add invented author names. */
export const authors = "Anonymous authors";

export type TerrainId = "normal" | "mud" | "cobblestone" | "snow";

export type Terrain = {
  id: TerrainId;
  label: string;
  headline: string;
  body: string;
  /** Path to a real MP4. Native video controls render ONLY when this is set. */
  videoUrl: string | null;
};

export const terrains: Terrain[] = [
  {
    id: "normal",
    label: "Normal",
    headline: "Stable forward motion",
    body: "Normal terrain yields stable forward motion with smooth, consistent future dynamics.",
    videoUrl: null,
  },
  {
    id: "mud",
    label: "Mud",
    headline: "Low stiffness · heavier, sinking steps",
    body: "The low-stiffness setting produces heavier, sinking steps in the illustrated robot–terrain interaction.",
    videoUrl: null,
  },
  {
    id: "cobblestone",
    label: "Cobblestone",
    headline: "High roughness · bumpy, uneven motion",
    body: "The high-roughness setting produces bumpy, uneven robot motion in the predicted future.",
    videoUrl: null,
  },
  {
    id: "snow",
    label: "Snow",
    headline: "Low friction · visible foot slippage",
    body: "The low-friction setting produces visible slippage during forward locomotion.",
    videoUrl: null,
  },
];

/** Optional MP4 URLs for the comparison gallery. */
export const comparisonVideos: Record<"drwm" | "cosmos" | "lingbot", string | null> = {
  drwm: null, cosmos: null, lingbot: null,
};
