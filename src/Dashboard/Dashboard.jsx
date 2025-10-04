import React from "react";
import { Clock, Bell, Users, Wrench } from "lucide-react";

// ----------------- StatsCards -----------------
const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow"
        >
          <h3 className="text-sm text-slate-500">{stat.title}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// ----------------- ActivityFeed -----------------
const icons = { Bell, Users, Wrench };
const ActivityFeed = ({ activities }) => {
  return (
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
                <p className="text-xs text-slate-500">{activity.description}</p>
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
  );
};

// ----------------- MaintenanceSummary -----------------
const MaintenanceSummary = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Maintenance Summary</h3>
      <p className="text-sm">Total Collected: {summary.collected}</p>
      <p className="text-sm">Pending: {summary.pending}</p>
    </div>
  );
};

// ----------------- Notices -----------------
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

// ----------------- ComplaintTracker -----------------
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

// ----------------- VisitorLogs -----------------
const VisitorLogs = ({ visitors }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Visitor Logs</h3>
      <ul className="space-y-2">
        {visitors.map((v, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>
              {v.name} ({v.purpose})
            </span>
            <span className="text-slate-500">{v.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----------------- Dashboard -----------------
const Dashboard = () => {
  const stats = [
    { title: "Residents", value: "120" },
    { title: "Visitors Today", value: "34" },
    { title: "Complaints Pending", value: "5" },
    { title: "Notices Issued", value: "3" },
  ];

  const activities = [
    {
      id: 1,
      icon: "Bell",
      title: "New Notice Posted",
      description: "Annual meeting scheduled",
      time: "2h ago",
      bgColor: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      id: 2,
      icon: "Users",
      title: "Visitor Logged",
      description: "John entered the premises",
      time: "4h ago",
      bgColor: "bg-green-100",
      color: "text-green-600",
    },
    {
      id: 3,
      icon: "Wrench",
      title: "Maintenance Work",
      description: "Lift maintenance ongoing",
      time: "6h ago",
      bgColor: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  const summary = {
    collected: "₹50,000",
    pending: "₹10,000",
  };

  const notices = [
    { date: "Oct 25", msg: "Annual General Body Meeting on Nov 10." },
    { date: "Oct 20", msg: "Painting work for Tower A starts next week." },
  ];

  const complaints = [
    { flat: "A-101", issue: "Lift not working", status: "Pending" },
    { flat: "B-205", issue: "Water leakage", status: "Resolved" },
    { flat: "C-302", issue: "No power in common area", status: "Pending" },
  ];

  const visitors = [
    { name: "Suresh", purpose: "Delivery", time: "10:30 AM" },
    { name: "Priya", purpose: "Guest", time: "09:45 AM" },
    { name: "Ramesh", purpose: "Service", time: "08:15 AM" },
  ];

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActivityFeed activities={activities} />
        <MaintenanceSummary summary={summary} />
        <Notices notices={notices} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComplaintTracker complaints={complaints} />
        <VisitorLogs visitors={visitors} />
      </div>
    </div>
  );
};

export default Dashboard;