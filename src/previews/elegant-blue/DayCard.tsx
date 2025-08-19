interface DayCardProps {
  day: string;
  when: string;
  date: string;
  gameName: string;
  graphicUrl?: string;
  logoUrl?: string;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  gameName,
  when,
  date,
  graphicUrl,
  logoUrl,
}) => {
  return (
    <div
      className="from-primary to-base relative grid h-[200px] grid-cols-[1fr_320px] items-center overflow-hidden rounded-2xl bg-linear-to-r to-50%"
      style={{
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.45)",
      }}
    >
      {/* left content */}
      <div className="relative z-10 flex items-center gap-4 p-4 pl-6">
        <div className="w-12 text-xs font-bold tracking-widest uppercase">
          {day}
        </div>

        <div className="flex min-w-0 grow justify-center gap-4 text-center">
          <div className="min-w-0">
            <div className="truncate text-2xl font-extrabold">
              {gameName || "Untitled Game"}
            </div>
            <div className="text-lg opacity-80">{when.replace(",", "")}</div>
            <div className="text-sm opacity-70">{date}</div>
          </div>
        </div>
      </div>

      {/* right banner */}
      <div className="relative h-full">
        {graphicUrl ? (
          <img
            src={graphicUrl}
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
};
