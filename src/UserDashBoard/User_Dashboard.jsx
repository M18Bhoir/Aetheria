// src/UserDashBoard/User_Dashboard.jsx
import React, { useState, useEffect } from "react"; // <-- Import useEffect
import { Link } from "react-router-dom";
import {
  Clock, Bell, Home, FileText, ClipboardList, Menu, X, CreditCard, User, AlertCircle // Import AlertCircle for error
} from "lucide-react";
import api from "../api"; // <-- Import the shared api instance

// --- UserStats Component (No changes needed, it receives stats) ---
const UserStats = ({ stats }) => {
  // ... (keep existing code) ...
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow min-h-[100px] flex flex-col justify-between" // Added min-height and flex
        >
          <div>
              <h3 className="text-sm text-slate-500">{stat.title}</h3>
              {stat.loading ? (
                 <div className="h-8 mt-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div> // Loading skeleton
              ) : stat.error ? (
                  <div className="flex items-center text-red-500 mt-1">
                      <AlertCircle size={18} className="mr-1"/>
                      <span className="text-sm">{stat.error}</span>
                  </div>
              ) : (
                 <p className="text-2xl font-bold">{stat.value}</p>
              )}
          </div>
          {/* Optional: Add due date or other info if available */}
          {stat.subText && !stat.loading && !stat.error && (
              <p className="text-xs text-slate-400 mt-1">{stat.subText}</p>
          )}
        </div>
      ))}
    </div>
};

// ... (MyComplaints, Notices, MaintenanceBills, ComplaintForm, Sidebar components remain the same) ...
export const Sidebar = () => { /* ... */ };
const MyComplaints = ({ complaints }) => { /* ... */ };
const Notices = ({ notices }) => { /* ... */ };
const MaintenanceBills = ({ bills }) => { /* ... */ };
const ComplaintForm = () => { /* ... */ };


// ----------------- Dashboard Component (UPDATED) -----------------
const User_Dashboard = () => {

  // --- State for Dues ---
  const [duesAmount, setDuesAmount] = useState(null);
  const [duesLoading, setDuesLoading] = useState(true);
  const [duesError, setDuesError] = useState(null);

  // --- Fetch Dues on Component Mount ---
  useEffect(() => {
    const fetchDues = async () => {
      setDuesLoading(true);
      setDuesError(null);
      try {
        // Use the shared api instance to make authenticated request
        const response = await api.get('/api/user/dues');
        setDuesAmount(response.data.amount); // Assuming backend sends { amount: number }
        // console.log("Fetched dues for:", response.data.name, "Amount:", response.data.amount);
      } catch (error) {
        console.error("Failed to fetch dues:", error);
        let errorMsg = "Couldn't load dues.";
         if (error.response?.status === 401) {
             errorMsg = "Auth error."; // Or redirect to login
         } else if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
         }
        setDuesError(errorMsg);
        setDuesAmount(0); // Set a default or keep null on error
      } finally {
        setDuesLoading(false);
      }
    };

    fetchDues();
  }, []); // Empty dependency array means this runs once on mount

  // --- Prepare User Stats Dynamically ---
  const userStats = [
    {
      title: "My Dues",
      value: duesAmount !== null ? `₹${duesAmount.toLocaleString()}` : 'N/A', // Format amount
      loading: duesLoading,
      error: duesError,
      // subText: duesDueDate ? `Due: ${duesDueDate}` : null // Example if you fetch due date
    },
    // Keep other stats static for now, or fetch them similarly
    { title: "Pending Complaints", value: "1" },
    { title: "Notices Read", value: "12" },
  ];

  // --- Sample data for other sections (keep as is or fetch similarly) ---
  const myComplaints = [ /* ... */ ];
  const notices = [ /* ... */ ];
  const maintenanceBills = [ /* ... */ ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-6 p-6">
        {/* Pass the dynamic userStats */}
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