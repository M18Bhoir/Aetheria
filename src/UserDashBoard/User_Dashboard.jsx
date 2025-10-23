import React, { useState, useEffect } from 'react';
// Corrected import path
import api from '../utils/api';

// Imports for Sidebar and NoticeBoard are removed as they are handled by UserLayout

function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(''); // State to hold user name

  useEffect(() => {
     // Fetch user data from local storage to display name
     const storedUser = localStorage.getItem('user');
     if (storedUser) {
       try {
         const userData = JSON.parse(storedUser);
         setUserName(userData.name || 'User'); // Use name or default
       } catch (e) {
         console.error("Failed to parse user data from localStorage", e);
         setUserName('User');
       }
     } else {
        setUserName('User'); // Default if no user data found
     }


    const fetchDues = async () => {
      setIsLoading(true); // Ensure loading is true at the start
      setError(null);
      try {
        // The API path should match your backend route, likely prefixed with /api
        const res = await api.get('/api/user/dues'); // Using the configured api instance
        setDues(res.data.dues); // Assuming backend sends { dues: amount }
      } catch (err) {
        console.error("Failed to fetch dues:", err);
         if (err.message !== "Unauthorized access - Redirecting to login.") { // Avoid double messaging
             setError(err.response?.data?.message || err.response?.data?.msg || "Could not load your dues data.");
         }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDues();
  }, []); // Empty dependency array means this runs once on mount

  // --- Render logic remains largely the same ---
  // Added conditional rendering for loading and error states

  return (
    <div>
      {/* Welcome message */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Welcome, {userName}!
      </h1>

      {/* Dues Widget */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6"> {/* Added mb-6 */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Your Current Dues
        </h2>
        {isLoading && <p className="text-gray-500 dark:text-gray-400">Loading dues...</p>}
        {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}
        {!isLoading && !error && (
          <p className="text-gray-900 dark:text-white">
            Amount:
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 ml-3">
              {dues !== null && typeof dues.amount === 'number'
                ? `₹${dues.amount.toLocaleString('en-IN')}`
                : 'N/A'
              }
            </span>
            {dues?.dueDate && (
                 <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                     Due Date: {new Date(dues.dueDate).toLocaleDateString()}
                 </span>
            )}
            {dues?.status && (
                <span className={`block text-sm mt-1 font-medium ${
                    dues.status === 'Paid' ? 'text-green-600 dark:text-green-400' :
                    dues.status === 'Overdue' ? 'text-red-600 dark:text-red-400' :
                    'text-yellow-600 dark:text-yellow-400' // Pending
                }`}>
                    Status: {dues.status}
                </span>
            )}
          </p>
        )}
      </div>

      {/* Placeholder for other dashboard components/widgets */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
               Quick Actions
           </h2>
           <p className="text-gray-500 dark:text-gray-400">
               {/* Add links or buttons here, e.g., to Voting System */}
               <a href="/dashboard/voting" className="text-blue-600 dark:text-blue-400 hover:underline">Go to Voting</a>
           </p>
       </div>

    </div>
  );
}

export default User_Dashboard;