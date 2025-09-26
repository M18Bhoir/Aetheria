import React from "react";
import { Clock, Bell, Users, Wrench } from "lucide-react";

const Dashboard = ({ activities, complaints }) => {
  const icons = { Bell, Users, Wrench }; // Map icon names to components

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-white dark:bg-slate-800 shadow p-4">
        <h1 className="text-lg font-bold">Society Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Activity Feed</h3>
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = icons[activity.icon];
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{activity.title}</h4>
                    <p className="text-xs text-slate-500">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaint Tracker */}
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
                <tr
                  key={i}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <td>{c.flat}</td>
                  <td>{c.issue}</td>
                  <td
                    className={
                      c.status === "Pending" ? "text-red-500" : "text-green-500"
                    }
                  >
                    {c.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
