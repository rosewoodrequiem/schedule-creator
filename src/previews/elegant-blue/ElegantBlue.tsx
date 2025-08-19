import { useScheduleStore } from "../../store/useScheduleStore";
import type { DayKey } from "../../types";
import {
  DAY_LABELS,
  fmtDateTime,
  shortMonthDay,
  weekDates,
} from "../../utils/date";
import NoiseOverlay from "../../components/NoiseOverlay";

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
    <div className="elegant-blue-theme">
      <div
        id={captureId}
        className="elegant-blue-theme bg-base relative overflow-hidden rounded-2xl border shadow-2xl"
        style={{ width: 1920, height: 1080 }}
      >
        {/* decorative soft highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 600px at 20% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)",
          }}
        />

        {/* LEFT: header + cards (put above hero via z-index) */}
        <div className="relative z-20 h-full">
          {/* week badge */}
          <div className="absolute top-8 left-8">
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
          <div className="font-heading text-primary absolute top-8 left-52 text-[120px] leading-none font-extrabold select-none">
            Schedule
          </div>

          {/* day cards column */}
          <div className="absolute top-44 right-[50%] bottom-16 left-8 flex flex-col gap-18 pr-6">
            {enabledKeys.length === 0 && (
              <div className="text-sm text-[#1e2a3a] opacity-70">
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
                  className="relative grid grid-cols-[1fr_320px] items-center overflow-hidden rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.30) 65%, rgba(255,255,255,0.24) 82%, rgba(255,255,255,0.20) 100%)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.45)",
                  }}
                >
                  {/* left content */}
                  <div className="relative z-10 flex items-center gap-4 p-4 pl-6">
                    <div className="w-12 text-xs font-bold tracking-widest text-[#1e2a3a] uppercase">
                      {DAY_LABELS[key].slice(0, 3)}
                    </div>

                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/60">
                        {plan.logoUrl ? (
                          <img
                            src={plan.logoUrl}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-[#1e2a3a]/70">
                            Logo
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-2xl font-extrabold text-[#1e2a3a]">
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
                        className="absolute inset-0 h-full w-full object-cover"
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
        <div className="absolute inset-y-0 right-0 z-10 w-[48%]">
          {hero ? (
            <img
              src={hero}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
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
        <div className="absolute bottom-6 left-8 z-20 text-sm text-[#1e2a3a] opacity-80">
          @evermoreradio · @EvermoreRadio
        </div>
      </div>
    </div>
  );
}
