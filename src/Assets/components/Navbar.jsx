import React from "react";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-slate-800 shadow p-4">
      <h1 className="text-lg font-bold">Society Dashboard</h1>
      <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">Logout</button>
    </header>
  );
};

export default Navbar;
