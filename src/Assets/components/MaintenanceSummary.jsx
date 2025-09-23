import React from "react";
const MaintenanceSummary = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Maintenance Summary</h3>
      <p className="text-sm">Total Collected: {summary.collected}</p>
      <p className="text-sm">Pending: {summary.pending}</p>
    </div>
  );
};
export default MaintenanceSummary;