import React from "react";
const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.title} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow">
          <h3 className="text-sm text-slate-500">{stat.title}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
export default StatsCards;