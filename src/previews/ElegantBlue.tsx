import React from "react";
import { useScheduleStore } from "../store/useScheduleStore";
import type { DayKey } from "../types";
import {
  DAY_LABELS,
  fmtDateTime,
  shortMonthDay,
  weekDates,
} from "../utils/date";

/**
 * 1920x1080 canvas
 * Left: stacked day cards (only enabled)
 * Right: hero image with blue gradient into background
 * Big translucent "Schedule" header like your reference
 */
export default function ElegantBlue({
  captureId = "capture-root",
}: {
  captureId?: string;
}) {
  const week = useScheduleStore((s) => s.week);
  const heroUrl = useScheduleStore((s) => s.heroUrl);
  const dayOrder: DayKey[] =
    week.weekStart === "sun"
      ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      : ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const dates = weekDates(week.weekAnchorDate, week.weekStart);

  const enabledKeys = dayOrder.filter((k) => week.days[k].enabled);
  const heroAuto = enabledKeys.find((k) => week.days[k].graphicUrl) || null;
  const hero =
    heroUrl ?? (heroAuto ? week.days[heroAuto].graphicUrl : undefined);

  return (
    <div
      id={captureId}
      className="relative overflow-hidden rounded-2xl shadow-2xl border"
      style={{
        width: 1920,
        height: 1080,
        background: "#90a4bf" /* base blue */,
      }}
    >
      {/* Decorative floral/soft texture feel via subtle overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1000px 600px at 20% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)",
        }}
      />

      {/* Right hero with gradient fade to left */}
      <div className="absolute inset-y-0 right-0 w-[48%]">
        {hero ? (
          <img
            src={hero}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#6b87aa]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-[#90a4bf] via-[#90a4bf]/70 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Accent badge with week range (top-left) */}
      <div className="absolute left-8 top-8">
        <div
          className="rounded-xl px-4 py-3 text-[#1e2a3a] font-semibold"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          {shortMonthDay(dates[0])} – {shortMonthDay(dates[6])}
        </div>
      </div>

      {/* Big translucent "Schedule" title */}
      <div className="absolute left-52 top-8 text-[120px] leading-none font-extrabold text-[#ffffff] opacity-40 select-none">
        Schedule
      </div>

      {/* Left column: stacked day rows */}
      <div className="absolute left-8 top-44 bottom-16 right-[50%] pr-6 flex flex-col gap-6">
        {enabledKeys.length === 0 && (
          <div className="text-[#1e2a3a] text-sm opacity-70">
            No days selected
          </div>
        )}

        {enabledKeys.map((key) => {
          const plan = week.days[key];
          const dateIndex = dayOrder.indexOf(key);
          const date = dates[dateIndex];
          const when = plan.time
            ? fmtDateTime(date, plan.time, plan.timezone)
            : "Time TBD";

          return (
            <div
              key={key}
              className="relative grid grid-cols-[1fr_320px] items-center rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.38), rgba(255,255,255,0.22))",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.45)",
              }}
            >
              {/* Left content */}
              <div className="relative z-10 p-4 pl-6 flex items-center gap-4">
                {/* day tag */}
                <div className="text-[#1e2a3a] text-xs font-bold tracking-widest uppercase">
                  {DAY_LABELS[key].slice(0, 3)}
                </div>

                {/* game logo + name + time/date */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* logo */}
                  <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/60 grid place-items-center">
                    {plan.logoUrl ? (
                      <img
                        src={plan.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-[#1e2a3a]/70">Logo</span>
                    )}
                  </div>

                  {/* text */}
                  <div className="min-w-0">
                    <div className="text-2xl font-extrabold text-[#1e2a3a] truncate">
                      {plan.gameName || "Untitled Game"}
                    </div>
                    <div className="text-lg text-[#1e2a3a] opacity-80">
                      {when.replace(",", "")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: game banner/graphic */}
              <div className="relative h-[110px]">
                {plan.graphicUrl ? (
                  <img
                    src={plan.graphicUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#7e96b7]" />
                )}
                {/* soft inner fade */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#90a4bf] via-transparent to-transparent opacity-70" />
                {/* white bevel borders */}
                <div className="absolute inset-0 ring-1 ring-white/40" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer handle icons placeholder (optional) */}
      <div className="absolute bottom-6 left-8 text-[#1e2a3a] text-sm opacity-80">
        @evermoreradio · @EvermoreRadio
      </div>
    </div>
  );
}
