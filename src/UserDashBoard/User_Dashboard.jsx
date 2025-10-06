import React, { useState } from "react";
import {
  Clock,
  Bell,
  Home,
  FileText,
  ClipboardList,
  Menu,
  X,
  CreditCard,
  User,
} from "lucide-react";

// ----------------- UserStats -----------------
const UserStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

// ----------------- MyComplaints -----------------
const MyComplaints = ({ complaints }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">My Complaints</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Issue</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, i) => (
            <tr
              key={i}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <td>{c.issue}</td>
              <td className="text-slate-500">{c.date}</td>
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

// ----------------- MaintenanceBills -----------------
const MaintenanceBills = ({ bills }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Maintenance Bills</h3>
      <ul className="space-y-3">
        {bills.map((bill, i) => (
          <li
            key={i}
            className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0"
          >
            <div>
              <p className="font-semibold">{bill.month}</p>
              <p className="text-xs text-slate-500">{bill.dueDate}</p>
            </div>
            <div
              className={`font-semibold ${
                bill.status === "Paid" ? "text-green-500" : "text-red-500"
              }`}
            >
              {bill.amount} ({bill.status})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----------------- ComplaintForm -----------------
const ComplaintForm = () => {
  const [issue, setIssue] = useState("");
  const [details, setDetails] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted successfully!");
    setIssue("");
    setDetails("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Submit a Complaint</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Issue Title
          </label>
          <input
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600"
            placeholder="e.g., Water Leakage"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-slate-700 dark:border-slate-600"
            placeholder="Provide more details about the issue."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// ----------------- Sidebar -----------------
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menu = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "My Profile", icon: <User size={18} /> },
    { name: "Notices", icon: <Bell size={18} /> },
    { name: "Maintenance", icon: <CreditCard size={18} /> },
    { name: "Complaints", icon: <ClipboardList size={18} /> },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 h-screen flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && <div className="text-xl font-bold">🏢 My Society</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="space-y-2 px-2 flex-1">
        {menu.map((item) => (
          <button
            key={item.name}
            className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ----------------- Dashboard -----------------
const User_Dashboard = () => {
  // Sample data for a specific user
  const userStats = [
    { title: "My Dues", value: "₹2,500" },
    { title: "Pending Complaints", value: "1" },
    { title: "Notices Read", value: "12" },
  ];

  const myComplaints = [
    {
      issue: "Lift not working",
      date: "Oct 25, 2025",
      status: "Pending",
    },
    {
      issue: "Water leakage in parking",
      date: "Oct 20, 2025",
      status: "Resolved",
    },
  ];

  const notices = [
    { date: "Oct 25", msg: "Annual General Body Meeting on Nov 10." },
    { date: "Oct 20", msg: "Painting work for Tower A starts next week." },
  ];

  const maintenanceBills = [
    {
      month: "October 2025",
      amount: "₹2,500",
      dueDate: "Nov 5, 2025",
      status: "Pending",
    },
    {
      month: "September 2025",
      amount: "₹2,500",
      dueDate: "Oct 5, 2025",
      status: "Paid",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-6">
        <UserStats stats={userStats} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MaintenanceBills bills={maintenanceBills} />
          <MyComplaints complaints={myComplaints} />
          <Notices notices={notices} />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <ComplaintForm />
        </div>
      </main>
    </div>
  );
};

export default User_Dashboard;