import React from "react";
import { useScheduleStore } from "../store/useScheduleStore";
import type { DayKey } from "../types";
import {
  DAY_LABELS,
  fmtDateTime,
  shortMonthDay,
  weekDates,
} from "../utils/date";
import NoiseOverlay from "../components/NoiseOverlay";

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
      style={{ width: 1920, height: 1080, background: "#90a4bf" }}
    >
      {/* decorative soft highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1000px 600px at 20% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)",
        }}
      />

      {/* LEFT: header + cards (put above hero via z-index) */}
      <div className="relative z-20 h-full">
        {/* week badge */}
        <div className="absolute left-8 top-8">
          <div
            className="rounded-xl px-4 py-3 font-semibold text-[#1e2a3a]"
            style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            {shortMonthDay(dates[0])} – {shortMonthDay(dates[6])}
          </div>
        </div>

        {/* big title */}
        <div className="absolute left-52 top-8 text-[120px] leading-none lh-tight font-extrabold text-white/40 select-none">
          Schedule
        </div>

        {/* day cards column */}
        <div className="absolute left-8 top-44 bottom-16 right-[50%] pr-6 flex flex-col gap-18">
          {enabledKeys.length === 0 && (
            <div className="text-[#1e2a3a] text-sm opacity-70">
              No days selected
            </div>
          )}

          {enabledKeys.map((key) => {
            const plan = week.days[key];
            const idx = dayOrder.indexOf(key);
            const date = dates[idx];
            const when = plan.time
              ? fmtDateTime(date, plan.time, plan.timezone)
              : "Time TBD";

            return (
              <div
                key={key}
                className="relative grid grid-cols-[1fr_320px] items-center rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.30) 65%, rgba(255,255,255,0.24) 82%, rgba(255,255,255,0.20) 100%)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.45)",
                }}
              >
                {/* left content */}
                <div className="relative z-10 p-4 pl-6 flex items-center gap-4">
                  <div className="text-[#1e2a3a] text-xs font-bold tracking-widest uppercase w-12">
                    {DAY_LABELS[key].slice(0, 3)}
                  </div>

                  <div className="flex items-center gap-4 min-w-0">
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

                {/* right banner */}
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
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(144,164,191,0) 0%, rgba(144,164,191,0.55) 55%, rgba(144,164,191,0.75) 72%, rgba(144,164,191,0.9) 88%, rgba(144,164,191,1) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 ring-1 ring-white/40" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: hero image (kept underneath cards) */}
      <div className="absolute inset-y-0 right-0 w-[48%] z-10">
        {hero ? (
          <img
            src={hero}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#6b87aa]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(144,164,191,0) 0%, rgba(144,164,191,0.65) 55%, rgba(144,164,191,0.85) 72%, rgba(144,164,191,0.95) 88%, rgba(144,164,191,1) 100%)",
          }}
        />
        <NoiseOverlay opacity={0.05} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* subtle canvas-wide noise */}
      <NoiseOverlay opacity={0.025} zIndex={5} radius={24} />

      {/* footer */}
      <div className="absolute bottom-6 left-8 text-[#1e2a3a] text-sm opacity-80 z-20">
        @evermoreradio · @EvermoreRadio
      </div>
    </div>
  );
}
