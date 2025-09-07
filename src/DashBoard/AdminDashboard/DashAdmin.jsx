// src/Dashboard/AdminDashboard/AdminDashboard.jsx

import React, { useState, createContext, useContext } from "react";
import { Home, Users, Settings, LogOut, MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";

// ✅ Sidebar Context
const SidebarContext = createContext();

// ✅ Sidebar Component
function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Top Section */}
        <div className="p-4 flex justify-between items-center">
          <h1 className={`font-bold text-xl ${expanded ? "block" : "hidden"}`}>Admin</h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

// ✅ Sidebar Item Component
function SidebarItem({ icon, text }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li className="flex items-center gap-3 p-2 my-1 cursor-pointer rounded-md hover:bg-gray-200 transition-colors">
      {icon}
      {expanded && <span className="text-gray-700 font-medium">{text}</span>}
    </li>
  );
}

// ✅ Admin Dashboard Component
export default function DashAdmin() {
  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Dashboard" />
        <SidebarItem icon={<Users size={20} />} text="Users" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LogOut size={20} />} text="Logout" />
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">120</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Active Complaints</h2>
            <p className="text-3xl font-bold text-red-500">8</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Revenue</h2>
            <p className="text-3xl font-bold text-green-600">₹50,000</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-3">
            <li className="border-b pb-2">User John registered</li>
            <li className="border-b pb-2">Complaint #202 resolved</li>
            <li className="border-b pb-2">New announcement posted</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
