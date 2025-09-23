import React, { useState } from "react";
import {
  Home,
  Users,
  Bell,
  Wrench,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menu = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "Residents", icon: <Users size={18} /> },
    { name: "Notices", icon: <Bell size={18} /> },
    { name: "Complaints", icon: <ClipboardList size={18} /> },
    { name: "Maintenance", icon: <Wrench size={18} /> },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {isOpen && <div className="text-xl font-bold">🏢 Society</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu */}
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

export default Sidebar;
