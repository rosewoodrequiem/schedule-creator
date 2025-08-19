import React from "react";
import type { DayPlan } from "../types";

const TZ_OPTIONS = [
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "UTC",
];

type Props = {
  open: boolean;
  onClose: () => void;
  plan: DayPlan;
  onChange: (next: DayPlan) => void;
  title: string; // e.g., "Edit Tuesday"
};

export default function DayEditor({
  open,
  onClose,
  plan,
  onChange,
  title,
}: Props) {
  if (!open) return null;

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
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold">{title}</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border">
            Close
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            Game name
            <input
              className="mt-1 w-full border rounded-lg p-2"
              value={plan.gameName}
              onChange={(e) => onChange({ ...plan, gameName: e.target.value })}
              placeholder="e.g., Baldur’s Gate 3"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              Time
              <input
                type="time"
                className="mt-1 w-full border rounded-lg p-2"
                value={plan.time}
                onChange={(e) => onChange({ ...plan, time: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Timezone
              <select
                className="mt-1 w-full border rounded-lg p-2"
                value={plan.timezone}
                onChange={(e) =>
                  onChange({ ...plan, timezone: e.target.value })
                }
              >
                {TZ_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </label>
          </div>

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

          <div className="text-xs text-[--color-muted,#94a3b8]">
            Tip: square-ish logos look best; graphics will be cropped to fill
            the card background.
          </div>
        </div>
      </div>
    </div>
  );
}
