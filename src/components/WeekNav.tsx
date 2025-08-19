// components/WeekNav.tsx
import { useScheduleStore } from "../store/useScheduleStore";

export function WeekNav() {
  const { nextWeek, prevWeek, weekOffset } = useScheduleStore();

  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <button
        onClick={prevWeek}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
      >
        ← Prev Week
      </button>
      <span className="text-sm font-medium">Week {weekOffset}</span>
      <button
        onClick={nextWeek}
        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
      >
        Next Week →
      </button>
    </div>
  );
}
