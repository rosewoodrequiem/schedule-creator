import React from "react";
import DayCard from "./DayCard";

const Sidebar = () => {
  const week = [
    { day: "Monday", events: ["Meeting 1", "Call 2"] },
    { day: "Tuesday", events: ["Event A", "Event B"] },
    { day: "Wednesday", events: ["Workshop"] },
    { day: "Thursday", events: ["Review", "Sync"] },
    { day: "Friday", events: ["Party 🎉"] },
  ];

  return (
    <div className="w-64 h-full overflow-y-auto space-y-3 p-3 bg-gray-50 border-r">
      {week.map((d) => (
        <DayCard key={d.day} day={d.day} events={d.events} />
      ))}
    </div>
  );
};

export default Sidebar;
