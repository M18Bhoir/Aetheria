import React from "react";
const Notices = ({ notices }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Notices</h3>
      <ul className="space-y-2">
        {notices.map((n, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold">{n.date}:</span> {n.msg}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Notices;