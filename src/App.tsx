import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import type { DayKey, DayPlan, WeekPlan } from "./types";
import {
  DAY_KEYS,
  DAY_LABELS,
  fmtDateTime,
  toISODate,
  weekDates,
} from "./utils/date";
import WeekPicker from "./components/WeekPicker";
import SchedulePreview from "./components/SchedulePreview";
import DayInlineEditor from "./components/DayInlineEditor";

const BROWSER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const DEFAULT_DAY: DayPlan = {
  enabled: false,
  gameName: "",
  time: "",
  timezone: BROWSER_TZ, // locked to browser tz
  logoUrl: undefined,
  graphicUrl: undefined,
};

function makeDefaultWeek(): WeekPlan {
  const todayISO = toISODate(new Date());
  const days = Object.fromEntries(
    DAY_KEYS.map((k) => [k, { ...DEFAULT_DAY }])
  ) as Record<DayKey, DayPlan>;
  return {
    weekAnchorDate: todayISO,
    weekStart: "mon",
    days,
  };
}

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
  const [state, setState] = useState<WeekPlan>(makeDefaultWeek());
  const [exportScale, setExportScale] = useState(2);

  const dates = useMemo(
    () => weekDates(state.weekAnchorDate, state.weekStart),
    [state.weekAnchorDate, state.weekStart]
  );

  // display order based on week start
  const dayOrder: DayKey[] =
    state.weekStart === "sun"
      ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      : ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const captureRef = useRef<HTMLDivElement>(null);

  function updateDay(key: DayKey, next: Partial<DayPlan>) {
    setState((s) => ({
      ...s,
      days: { ...s.days, [key]: { ...s.days[key], ...next } },
    }));
  }
  function setDayPlan(key: DayKey, next: DayPlan) {
    setState((s) => ({ ...s, days: { ...s.days, [key]: next } }));
  }

  async function handleExport() {
    const node = captureRef.current;
    if (!node) return;
    // ensure fonts
    // @ts-ignore
    if (document.fonts?.ready) await document.fonts.ready;

    const canvas = await html2canvas(node, {
      scale: Math.max(1, Math.min(4, exportScale || 2)),
      backgroundColor: null,
      useCORS: true,
      removeContainer: true,
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
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[420px_1fr]">
      {/* LEFT: Controls */}
      <aside className="border-r p-4 space-y-4 bg-white">
        {/* header with Export */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Schedule Maker</div>
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg bg-[#111827] text-white"
            title="Export a high-resolution PNG of the preview"
          >
            Export PNG
          </button>
        </div>

        {/* export scale */}
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

        {/* week picker */}
        <WeekPicker
          weekStart={state.weekStart}
          anchorISO={state.weekAnchorDate}
          onChangeStart={(v) => setState((s) => ({ ...s, weekStart: v }))}
          onChangeAnchor={(iso) =>
            setState((s) => ({ ...s, weekAnchorDate: iso }))
          }
          onQuickSet={(type) => {
            const now = new Date();
            if (type === "next") now.setDate(now.getDate() + 7);
            setState((s) => ({ ...s, weekAnchorDate: toISODate(now) }));
          }}
        />

        {/* Day checklist chips */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Streaming days</div>
          <div className="flex flex-wrap gap-2">
            {dayOrder.map((key) => {
              const enabled = state.days[key].enabled;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer select-none
                    ${
                      enabled
                        ? "bg-[--color-brand] text-black"
                        : "bg-white text-black"
                    }`}
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
            Check the days you’re streaming. Checked days show inputs below
            (timezone auto-uses your browser).
          </div>
        </div>

        {/* Inline editors for checked days (no timezone control) */}
        <div className="space-y-3 pt-2">
          {dayOrder.map((key, i) => {
            const plan = state.days[key];
            if (!plan.enabled) return null;
            return (
              <div key={key} className="rounded-2xl border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">{DAY_LABELS[key]}</div>
                  <button
                    className="text-xs px-2 py-1 border rounded-lg"
                    onClick={() => updateDay(key, { enabled: false })}
                    title="Hide this day"
                  >
                    Hide
                  </button>
                </div>
                <DayInlineEditor
                  plan={plan}
                  onChange={(next) => setDayPlan(key, next)}
                />
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT: Preview */}
      <main className="p-4 overflow-auto">
        <div ref={captureRef}>
          <SchedulePreview
            weekDates={dates}
            byKey={state.days}
            dayOrder={dayOrder}
          />
        </div>
      </main>
    </div>
  );
}
