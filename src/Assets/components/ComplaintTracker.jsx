import React from "react";
const ComplaintTracker = ({ complaints }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Complaint Tracker</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Flat</th>
            <th>Issue</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, i) => (
            <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
              <td>{c.flat}</td>
              <td>{c.issue}</td>
              <td className={c.status === "Pending" ? "text-red-500" : "text-green-500"}>
                {c.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ComplaintTracker;