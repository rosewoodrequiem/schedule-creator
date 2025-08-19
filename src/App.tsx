import React, { useState } from "react";
import html2canvas from "html2canvas-pro";
import { useScheduleStore } from "./store/useScheduleStore";
import type { DayKey } from "./types";
import { DAY_KEYS, DAY_LABELS } from "./utils/date";
import WeekPicker from "./components/WeekPicker";
import SchedulePreview from "./components/SchedulePreview";
import TemplatePicker from "./components/TemplatePicker";
import ScaledPreview from "./components/ScaledPreview";
import Button from "./components/ui/Button";
import DayAccordion from "./components/DayAccordion";

const SHORTS: Record<DayKey, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

export default function App() {
  const week = useScheduleStore((s) => s.week);
  const updateDay = useScheduleStore((s) => s.updateDay);
  const setDay = useScheduleStore((s) => s.setDay);
  const setHeroUrl = useScheduleStore((s) => s.setHeroUrl);

  const [exportScale, setExportScale] = useState(2);

  const dayOrder: DayKey[] =
    week.weekStart === "sun"
      ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      : ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  async function handleExport() {
    const src = document.getElementById("capture-root");
    if (!src) return;

    // Ensure fonts are loaded
    // @ts-ignore
    if (document.fonts?.ready) await document.fonts.ready;

    // Clone the node so we can render it at 1:1 scale with no transforms
    const clone = src.cloneNode(true) as HTMLElement;

    // Make sure the clone is positioned off-screen and not scaled
    Object.assign(clone.style, {
      position: "fixed",
      left: "-100000px",
      top: "0",
      transform: "none",
      zoom: "1",
    });

    // Important: ensure the clone has the intended fixed canvas size
    // (your preview templates already set width/height inline, so this is usually redundant,
    // but we keep it for safety in case you change templates)
    clone.id = "capture-root-clone"; // avoid duplicate IDs during query

    // Append to DOM so computed styles resolve correctly
    document.body.appendChild(clone);

    const pixelRatio = Math.max(window.devicePixelRatio || 1, 2);
    const targetScale = Math.max(exportScale || 2, pixelRatio * 1.5);

    try {
      const canvas = await html2canvas(clone, {
        scale: targetScale,
        backgroundColor: null,
        useCORS: true,
        removeContainer: true,
        // Extra safety: ignore any transforms on ancestors (we cloned, but this helps if you nest later)
        onclone: (doc) => {
          const el = doc.getElementById(
            "capture-root-clone"
          ) as HTMLElement | null;
          if (el) {
            // Force no transforms on the cloned tree’s ancestors as well
            let p = el.parentElement;
            while (p) {
              p.style.transform = "none";
              p = p.parentElement;
            }
          }
        },
      });

      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), "image/png")
      );
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schedule.png";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      // Clean up the clone
      clone.remove();
    }
  }

  return (
    <div className="h-full grid md:grid-cols-[460px_1fr]">
      {/* LEFT: Controls (scrollable) */}
      <aside className="border-r p-4 space-y-4 bg-white sidebar-scroll">
        <div className="flex items-center justify-between sticky top-0 bg-white pb-2">
          <div className="text-lg font-bold">Schedule Maker</div>
          <Button
            onClick={handleExport}
            className="bg-[#111827] text-white"
            hoverClass="hover:bg-black"
          >
            Export PNG
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <TemplatePicker />
          <label className="block text-xs">
            Export scale (1–4)
            <input
              type="number"
              min={1}
              max={4}
              value={exportScale}
              onChange={(e) => setExportScale(Number(e.target.value))}
              className="ml-2 w-20 border rounded-lg px-2 py-1"
            />
          </label>
        </div>

        <WeekPicker />

        {/* Day checklist chips */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Streaming days</div>
          <div className="flex flex-wrap gap-2">
            {dayOrder.map((key) => {
              const enabled = week.days[key].enabled;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer select-none
                    ${
                      enabled
                        ? "bg-[--color-brand] text-black"
                        : "bg-white text-black"
                    }
                    hover:brightness-105`}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={enabled}
                    onChange={(e) =>
                      updateDay(key, { enabled: e.target.checked })
                    }
                  />
                  <span className="text-sm">{SHORTS[key]}</span>
                </label>
              );
            })}
          </div>
          <div className="text-xs text-[--color-muted,#64748b]">
            Check days you’re streaming, then expand any day to edit details.
          </div>
        </div>

        {/* Hero image override */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Hero image (optional)</div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-[--color-brand] text-black"
              hoverClass="hover:brightness-105"
              onClick={() =>
                document.getElementById("hero-file-input")?.click()
              }
            >
              Select hero image
            </Button>
            <input
              id="hero-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return setHeroUrl(undefined);
                setHeroUrl(URL.createObjectURL(f));
              }}
            />
            <Button
              className="bg-white border hover:bg-[#f3f4f6]"
              onClick={() => setHeroUrl(undefined)}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Collapsible day cards for enabled days */}
        <div className="space-y-3 pt-2 pb-8">
          {dayOrder.map((key, idx) => {
            const plan = week.days[key];
            if (!plan.enabled) return null;

            // derive the date for this key from the current week order
            // NOTE: WeekPicker controls the anchor date; previews use weekDates internally.
            // For sidebar cards we only need the weekday label; using today's mapping is fine.
            // If you want exact date mapping here too, lift the weekDates calc into store and pass in.
            const anchor = new Date(week.weekAnchorDate);
            const startIdx = week.weekStart === "sun" ? 0 : 1;
            const diffFromStart =
              (
                ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as DayKey[]
              ).indexOf(key) - startIdx;
            const date = new Date(anchor);
            date.setDate(anchor.getDate() + diffFromStart);

            return (
              <DayAccordion
                key={key}
                dayKey={key}
                date={date}
                plan={plan}
                onChange={(next) => setDay(key, next)}
                onDisable={() => updateDay(key, { enabled: false })}
              />
            );
          })}
        </div>
      </aside>

      {/* RIGHT: Preview (no scroll; scaled to fit) */}
      <main className="p-4 overflow-hidden bg-[#f8fafc]">
        <ScaledPreview targetWidth={1920} targetHeight={1080} margin={16}>
          <SchedulePreview />
        </ScaledPreview>
      </main>
    </div>
  );
}
