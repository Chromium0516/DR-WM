import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SceneNavigationItem = {
  id: string;
  label: string;
  title?: string;
};

type SceneNavigatorProps = {
  items: readonly SceneNavigationItem[];
  activeIndex: number;
  label: string;
  panelId: string;
  onSelect: (index: number, direction: -1 | 1) => void;
};

export function SceneNavigator({ items, activeIndex, label, panelId, onSelect }: SceneNavigatorProps) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const button = tabs.current[activeIndex];
    const container = track.current;
    if (!button || !container) return;
    container.scrollTo({
      left: container.scrollLeft + button.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - button.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [activeIndex]);

  function choose(index: number, direction?: -1 | 1) {
    if (index === activeIndex) return;
    onSelect(index, direction ?? (index > activeIndex ? 1 : -1));
  }

  function move(offset: -1 | 1) {
    const index = (activeIndex + offset + items.length) % items.length;
    choose(index, offset);
    tabs.current[index]?.focus();
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const direction: -1 | 1 = event.key === "ArrowLeft" || event.key === "Home" ? -1 : 1;
    choose(nextIndex, direction);
    tabs.current[nextIndex]?.focus();
  }

  return (
    <div className="demo-selector" aria-label={label}>
      <button type="button" className="demo-selector-arrow" onClick={() => move(-1)} aria-label="Show previous demo">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <div ref={track} className="demo-selector-track" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => { tabs.current[index] = element; }}
            id={`${panelId}-tab-${item.id}`}
            type="button"
            role="tab"
            className="demo-selector-tab"
            aria-selected={index === activeIndex}
            aria-controls={panelId}
            tabIndex={index === activeIndex ? 0 : -1}
            title={item.title}
            onClick={() => choose(index)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button type="button" className="demo-selector-arrow" onClick={() => move(1)} aria-label="Show next demo">
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
