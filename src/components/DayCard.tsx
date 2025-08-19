import React from "react";
import type { DayPlan } from "../types";
import { shortMonthDay } from "../utils/date";

type Props = {
  date: Date;
  label: string; // "Monday"
  plan: DayPlan;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
  formattedWhen?: string; // e.g., "Jul 23, 8:00 PM EST"
};

export default function DayCard({
  date,
  label,
  plan,
  onToggle,
  onEdit,
  formattedWhen,
}: Props) {
  const sub = shortMonthDay(date);
  return (
    <div className="rounded-2xl p-4 border bg-white/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-[--color-muted,#94a3b8]">{sub}</div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={plan.enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          Streaming
        </label>
      </div>

      {plan.enabled ? (
        <div className="mt-3 space-y-2">
          <div className="text-sm">
            <span className="font-semibold">
              {plan.gameName || "Untitled Game"}
            </span>
          </div>
          <div className="text-xs text-[--color-muted,#94a3b8]">
            {formattedWhen || "Set time…"}
          </div>
          <button
            className="px-3 py-1 rounded-lg bg-[--color-brand] text-white"
            onClick={onEdit}
          >
            Edit details
          </button>
        </div>
      ) : (
        <div className="mt-3 text-xs text-[--color-muted,#94a3b8]">
          No stream planned
        </div>
      )}
    </div>
  );
}
