import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import ScheduleCard from "./components/ScheduleCard";
import type { ScheduleData, Row } from "./types";

const DEFAULT_ROWS: Row[] = [
  { time: "Mon 7 PM", event: "Stream — Persona Deep Dive" },
  { time: "Wed 8 PM", event: "Podcast — Evermore Radio Ep. 12" },
  { time: "Fri 9 PM", event: "Gaming Night — Baldur’s Gate 3" },
];

const SIZES = {
  "1920×1080": { w: 1920, h: 1080 },
  "1080×1350 (Portrait)": { w: 1080, h: 1350 },
  "1080×1080 (Square)": { w: 1080, h: 1080 },
};

function parseRows(input: string): Row[] {
  try {
    const val = JSON.parse(input);
    if (Array.isArray(val)) {
      return val
        .map((x) => ({
          time: String(x?.time ?? ""),
          event: String(x?.event ?? ""),
        }))
        .slice(0, 50);
    }
  } catch {}
  return [];
}

export default function App() {
  const [title, setTitle] = useState("Evermore Estate Weekly");
  const [dateRange, setDateRange] = useState("Aug 18–24");
  const [rowsInput, setRowsInput] = useState(
    JSON.stringify(DEFAULT_ROWS, null, 2)
  );
  const [bg, setBg] = useState("#0b0b12");
  const [card, setCard] = useState("#111827");
  const [accent, setAccent] = useState("#ff2952");
  const [sizeKey, setSizeKey] = useState<keyof typeof SIZES>("1920×1080");
  const [exportScale, setExportScale] = useState(2);

  const captureRef = useRef<HTMLDivElement>(null);

  const data: ScheduleData = useMemo(
    () => ({
      title,
      dateRange,
      rows: parseRows(rowsInput),
      theme: { bg, card, accent },
      size: SIZES[sizeKey],
      exportScale: Math.max(1, Math.min(4, exportScale || 1)),
    }),
    [title, dateRange, rowsInput, bg, card, accent, sizeKey, exportScale]
  );

  async function handleExport() {
    const node = captureRef.current;
    if (!node) return;

    // ensure webfonts are loaded before capture
    // @ts-ignore
    if (document.fonts?.ready) await document.fonts.ready;

    const canvas = await html2canvas(node, {
      scale: data.exportScale,
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
    <div className="min-h-screen grid md:grid-cols-[320px_1fr]">
      {/* Controls */}
      <aside className="border-r border-slate-200 p-4 space-y-3">
        <h1 className="text-xl font-bold">Schedule Maker</h1>
        <p className="text-xs text-slate-500">
          Vite + React + TS · All client-side
        </p>

        <label className="text-xs text-slate-600">Title</label>
        <input
          className="w-full border rounded-lg p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-xs text-slate-600">Date Range</label>
        <input
          className="w-full border rounded-lg p-2"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        />

        <label className="text-xs text-slate-600">Rows (JSON)</label>
        <textarea
          rows={8}
          className="w-full border rounded-lg p-2 font-mono text-sm"
          value={rowsInput}
          onChange={(e) => setRowsInput(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-slate-600">BG</label>
            <input
              type="color"
              className="w-full h-10 border rounded"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Card</label>
            <input
              type="color"
              className="w-full h-10 border rounded"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Accent</label>
            <input
              type="color"
              className="w-full h-10 border rounded"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 items-end">
          <div>
            <label className="text-xs text-slate-600">Canvas Size</label>
            <select
              className="w-full border rounded-lg p-2"
              value={sizeKey}
              onChange={(e) => setSizeKey(e.target.value as keyof typeof SIZES)}
            >
              {Object.keys(SIZES).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-600">Export Scale (1–4)</label>
            <input
              type="number"
              min={1}
              max={4}
              value={exportScale}
              onChange={(e) => setExportScale(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {}}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white"
            title="Live updates already apply; this exists for parity with earlier mock."
          >
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg border"
          >
            Export PNG
          </button>
        </div>

        <details className="pt-2">
          <summary className="text-sm font-semibold">Tips</summary>
          <ul className="text-xs text-slate-600 list-disc pl-5 space-y-1 mt-2">
            <li>
              Use <b>Export Scale</b> 2–3 for crisp text.
            </li>
            <li>
              If you add external images, host them in this repo or ensure the
              CDN sends CORS headers.
            </li>
            <li>
              Next steps: a friendlier row editor, font picker, theme presets
              via <code>localStorage</code>.
            </li>
          </ul>
        </details>
      </aside>

      {/* Preview */}
      <main className="p-4 overflow-auto">
        <ScheduleCard data={data} captureRef={captureRef} />
      </main>
    </div>
  );
}
