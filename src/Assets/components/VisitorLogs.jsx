import React from "react";
const VisitorLogs = ({ visitors }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Visitor Logs</h3>
      <ul className="space-y-2">
        {visitors.map((v, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{v.name} ({v.purpose})</span>
            <span className="text-slate-500">{v.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default VisitorLogs;