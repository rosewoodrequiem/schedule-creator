import React from "react";
import type { DayPlan } from "../types";

type Props = {
  plan: DayPlan;
  onChange: (next: DayPlan) => void;
};

export default function DayInlineEditor({ plan, onChange }: Props) {
  function onFile(
    e: React.ChangeEvent<HTMLInputElement>,
    key: "logoUrl" | "graphicUrl"
  ) {
    const f = e.target.files?.[0];
    if (!f) return onChange({ ...plan, [key]: undefined });
    const url = URL.createObjectURL(f);
    onChange({ ...plan, [key]: url });
  }

  return (
    <div className="grid gap-3">
      <label className="block text-sm">
        Game name
        <input
          className="mt-1 w-full border rounded-lg p-2"
          value={plan.gameName}
          onChange={(e) => onChange({ ...plan, gameName: e.target.value })}
          placeholder="e.g., Baldur’s Gate 3"
        />
      </label>

      <label className="text-sm">
        Time
        <input
          type="time"
          className="mt-1 w-full border rounded-lg p-2"
          value={plan.time}
          onChange={(e) => onChange({ ...plan, time: e.target.value })}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-sm font-semibold">Game logo</div>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            onChange={(e) => onFile(e, "logoUrl")}
          />
          {plan.logoUrl && (
            <div className="mt-2 border rounded-lg overflow-hidden">
              <img
                src={plan.logoUrl}
                alt="Logo preview"
                className="w-full h-28 object-contain bg-white"
              />
              <button
                className="w-full text-xs py-1 border-t"
                onClick={() => onChange({ ...plan, logoUrl: undefined })}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-semibold">Game graphic</div>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            onChange={(e) => onFile(e, "graphicUrl")}
          />
          {plan.graphicUrl && (
            <div className="mt-2 border rounded-lg overflow-hidden">
              <img
                src={plan.graphicUrl}
                alt="Graphic preview"
                className="w-full h-28 object-cover"
              />
              <button
                className="w-full text-xs py-1 border-t"
                onClick={() => onChange({ ...plan, graphicUrl: undefined })}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-[--color-muted,#64748b]">
        Tip: square logos look best. Graphics are cropped to fill the preview
        card.
      </div>
    </div>
  );
}
