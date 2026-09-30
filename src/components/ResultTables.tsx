import { useRef, useState } from "react";

type TabId = "dynamics" | "fidelity";

const dynamicsRows = [
  { m: "Geometry Only", v: ["0.1683", "0.0830", "8.0215", "1.2238"] },
  { m: "Uniform PhyMap", v: ["0.1450", "0.0500", "4.8269", "1.0850"] },
  { m: "Full PhyMap", v: ["0.1380", "0.0378", "3.3553", "1.0246"], best: true },
];

const fidelityRows = [
  { m: "CogVideoX1.5", v: ["13.68", "0.4810", "0.6082", "21.546", "738.37"] },
  { m: "Wan2.2-TI2V", v: ["13.53", "0.4272", "0.6990", "18.819", "683.42"] },
  { m: "Cosmos 3", v: ["15.09", "0.3987", "0.7441", "11.992", "801.40"] },
  { m: "LingBot-World", v: ["13.58", "0.5020", "0.6021", "16.329", "1148.22"] },
  { m: "DR-WM", v: ["17.01", "0.2818", "0.7993", "6.001", "567.27"], best: true },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "dynamics", label: "Predicted dynamics" },
  { id: "fidelity", label: "Observation fidelity" },
];

function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: { m: string; v: string[]; best?: boolean }[];
  caption: string;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-left text-base">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-surface-strong">
              {head.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={
                    "whitespace-nowrap border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground " +
                    (i === 0 ? "" : "text-right")
                  }
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.m} className={r.best ? "bg-accent/60" : undefined}>
                <th
                  scope="row"
                  className={
                    "whitespace-nowrap border-b border-border px-4 py-3 font-medium " +
                    (r.best ? "text-primary" : "text-foreground")
                  }
                >
                  {r.m}
                </th>
                {r.v.map((val, i) => (
                  <td
                    key={i}
                    className={
                      "numeric whitespace-nowrap border-b border-border px-4 py-3 text-right " +
                      (r.best ? "font-semibold text-primary" : "text-foreground")
                    }
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ResultTables() {
  const [active, setActive] = useState<TabId>("dynamics");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (next < 0) return;
    e.preventDefault();
    const target = tabs[next];
    if (!target) return;
    setActive(target.id);
    refs.current[target.id]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Result tables"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1"
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`rtab-${t.id}`}
              aria-selected={selected}
              aria-controls={`rpanel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={
                "flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors " +
                (selected
                  ? "bg-background text-primary ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`rpanel-${active}`}
        aria-labelledby={`rtab-${active}`}
        tabIndex={0}
        className="mt-6"
      >
        {active === "dynamics" ? (
          <div>
            <Table
              caption="Predicted dynamics accuracy across PhyMap ablations, manuscript Table 4."
              head={[
                "Method",
                "Base ATE (m) ↓",
                "Vertical RMSE (m) ↓",
                "Roll/Pitch RMSE (°) ↓",
                "Velocity RMSE (m/s) ↓",
              ]}
              rows={dynamicsRows}
            />
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                Manuscript Table 4, on 34 held-out clips from 22 scenes. All rows share the same
                geometry, initial robot state, recorded actions, controller and simulator; only the
                physical field supplied to the simulator changes. Full PhyMap retains spatial
                variation, while Uniform PhyMap broadcasts each field&rsquo;s mean over the scene.
              </p>
              <p>Note: the vertical-motion analysis is exploratory.</p>
            </div>
          </div>
        ) : (
          <div>
            <Table
              caption="Observation fidelity against video world-model baselines, manuscript Table 2."
              head={["Method", "PSNR ↑", "LPIPS ↓", "DINO ↑", "Flow EPE ↓", "FVD-16 ↓"]}
              rows={fidelityRows}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Manuscript Table 2, evaluated on held-out SCAND, TartanDrive, RECON, HuRoN and DEEP
              Robotics M20 / Lite3 data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
