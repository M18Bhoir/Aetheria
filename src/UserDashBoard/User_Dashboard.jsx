import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // --- Fetch User Info from localStorage ---
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUserName(parsedUser.name || 'User');
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }

    // --- Fetch Dues from API ---
    const fetchDues = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/user/dues');
        setDues(res.data.dues);
      } catch (err) {
        console.error('Failed to fetch dues:', err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            'Could not load dues data.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDues();
  }, []);

  return (
    <div>
      {/* --- Welcome Message --- */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Welcome, {userName}!
      </h1>

      {/* --- Dues Widget --- */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Your Current Dues
        </h2>

        {isLoading && <p className="text-gray-500">Loading dues...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!isLoading && !error && (
          <p className="text-gray-900 dark:text-white">
            Amount:
            <span className="text-2xl font-bold text-blue-600 ml-3">
              {dues?.amount
                ? `₹${dues.amount.toLocaleString('en-IN')}`
                : 'N/A'}
            </span>

            {dues?.dueDate && (
              <span className="block text-sm text-gray-500 mt-1">
                Due Date: {new Date(dues.dueDate).toLocaleDateString()}
              </span>
            )}

            {dues?.status && (
              <span
                className={`block text-sm mt-1 font-medium ${
                  dues.status === 'Paid'
                    ? 'text-green-600'
                    : dues.status === 'Overdue'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                Status: {dues.status}
              </span>
            )}
          </p>
        )}
      </div>

      {/* --- Quick Actions --- */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Quick Actions
        </h2>
        <p className="text-gray-500">
          <a
            href="/dashboard/voting"
            className="text-blue-600 hover:underline"
          >
            Go to Voting
          </a>
        </p>
      </div>
    </div>
  );
}

export default User_Dashboard;
