import React from "react";
import type { DayKey, DayPlan } from "../types";
import { DAY_LABELS, fmtDateTime, shortMonthDay } from "../utils/date";

type Props = {
  weekDates: Date[]; // 7 dates in order
  byKey: Record<DayKey, DayPlan>;
  dayOrder: DayKey[]; // order based on week start
};

export default function SchedulePreview({ weekDates, byKey, dayOrder }: Props) {
  // Only enabled days
  const enabledKeys = dayOrder.filter((k, i) => byKey[k].enabled);
  // pick hero image: first enabled day with a graphic, else null
  const heroKey = enabledKeys.find((k) => byKey[k].graphicUrl) || null;
  const heroUrl = heroKey ? byKey[heroKey].graphicUrl : undefined;

  return (
    <div
      id="capture-root"
      className="relative overflow-hidden rounded-2xl shadow-2xl border"
      style={{ width: 1920, height: 1080, background: "#0b0b12" }}
    >
      {/* accent bar */}
      <div className="absolute inset-x-0 top-0 h-2 bg-[--color-brand]"></div>

      {/* split layout: left list, right hero */}
      <div className="grid grid-cols-[680px_1fr] gap-0 h-full">
        {/* LEFT: days column */}
        <div className="h-full p-10">
          <div className="text-5xl font-extrabold text-white tracking-tight">
            Weekly Schedule
          </div>
          <div className="text-sm mt-2 text-[#cbd5e1]">
            Only showing selected days
          </div>

          <div className="mt-6 flex flex-col gap-4 pr-4">
            {enabledKeys.length === 0 && (
              <div className="text-[#94a3b8] text-sm">No days selected.</div>
            )}

            {enabledKeys.map((key, idx) => {
              const plan = byKey[key];
              // weekDates index aligns to dayOrder, so map to that index:
              const dateIndex = dayOrder.indexOf(key);
              const date = weekDates[dateIndex];
              const when = plan.time
                ? fmtDateTime(date, plan.time, plan.timezone)
                : "Time TBD";

              return (
                <div
                  key={key}
                  className="relative rounded-2xl overflow-hidden border"
                >
                  {/* subtle bg */}
                  <div className="absolute inset-0 bg-[#0f172a]"></div>
                  <div className="relative z-10 p-4 flex gap-3 items-center">
                    {/* logo */}
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-white/10 grid place-items-center overflow-hidden">
                      {plan.logoUrl ? (
                        <img
                          src={plan.logoUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-white/70">Logo</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white/80">
                        {DAY_LABELS[key]} — {shortMonthDay(date)}
                      </div>
                      <div className="text-xl font-bold text-white truncate">
                        {plan.gameName || "Untitled Game"}
                      </div>
                      <div className="text-sm text-white/80">{when}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: hero image with gradient into bg */}
        <div className="relative">
          {heroUrl ? (
            <img
              src={heroUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#111827]" />
          )}
          {/* gradient fade into background color (left side fade) */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#0b0b12] via-[#0b0b12]/40 to-transparent" />
          {/* soft dark overlay for legibility if needed */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* footer */}
      <div className="absolute bottom-4 left-10 text-[#94a3b8] text-sm">
        Made with Schedule Maker
      </div>
    </div>
  );
}
