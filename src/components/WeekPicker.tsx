import React from "react";
import { toISODate, weekDates } from "../utils/date";

type Props = {
  weekStart: "sun" | "mon";
  anchorISO: string;
  onChangeStart: (v: "sun" | "mon") => void;
  onChangeAnchor: (iso: string) => void;
  onQuickSet: (type: "this" | "next") => void;
};

export default function WeekPicker({
  weekStart,
  anchorISO,
  onChangeAnchor,
  onChangeStart,
  onQuickSet,
}: Props) {
  const dates = weekDates(anchorISO, weekStart);
  const rangeLabel = `${dates[0].toLocaleDateString()} – ${dates[6].toLocaleDateString()}`;

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">Pick a week</div>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">Week starts on</label>
        <select
          className="border rounded-lg px-2 py-1"
          value={weekStart}
          onChange={(e) => onChangeStart(e.target.value as "sun" | "mon")}
        >
          <option value="sun">Sunday</option>
          <option value="mon">Monday</option>
        </select>

        <label className="text-xs">Any date in that week</label>
        <input
          type="date"
          className="border rounded-lg px-2 py-1"
          value={anchorISO}
          onChange={(e) => onChangeAnchor(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-1 border rounded-lg"
          onClick={() => onQuickSet("this")}
        >
          This week
        </button>
        <button
          className="px-3 py-1 border rounded-lg"
          onClick={() => onQuickSet("next")}
        >
          Next week
        </button>
      </div>

      <div className="text-xs text-[--color-muted,#94a3b8]">
        Week range: {rangeLabel}
      </div>
    </div>
  );
}
