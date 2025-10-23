import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 

// --- 1. ---
// We REMOVE the imports for Sidebar and NoticeBoard
// because App.jsx (UserLayout) is now handling them.
// import Sidebar from '../Components/Sidebar';
// import NoticeBoard from '../Components/NoticeBoard';


function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This data fetching logic is perfect. No changes needed.
    const fetchDues = async () => {
      try {
        const res = await api.get('/api/user/dues');
        setDues(res.data.dues);
      } catch (err) {
        console.error("Failed to fetch dues:", err);
        setError("Could not load your dues.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDues();
  }, []);

  if (isLoading) {
    // Keep this simple, as it's just a part of the page
    return <div><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="text-red-500"><h1>Error: {error}</h1></div>;
  }

  // --- 2. ---
  // We REMOVE the layout <div>s.
  // This component now *only* returns the main page content.
  // This content will be placed inside the <main> tag of your UserLayout.
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      
      {/* This is the "Dues" widget */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-medium">
          Your Current Dues: 
          <span className="text-2xl font-bold text-blue-600 ml-3">
            {typeof dues === 'number' 
              ? `₹${dues.toLocaleString('en-IN')}`
              : 'N/A'
            }
          </span>
        </h2>
      </div>

      {/* When you're ready, you can add your voting system here */}
      {/* <VotingSystem /> */}

    </div>
  );
}

export default User_Dashboard;