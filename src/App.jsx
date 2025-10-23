import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

// --- Page & Component Imports ---
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import AdminDashboard from './Dashboard/Dashboard';
import UserDashboard from './UserDashBoard/User_Dashboard';
import Profile from './Profile/Profile';
import { PollList, PollDetail } from './Voting_System/VotingSystem';
import CreatePoll from './Voting_System/CreatePoll';

// --- Layout Component Imports ---
import Sidebar from './Components/Sidebar'; // Assuming Sidebar is here
import NoticeBoard from './Components/NoticeBoard'; // Assuming NoticeBoard is here

import './index.css';

// --- 1. Shared Layout for the User Dashboard ---
// This component renders the shared sidebar and notice board,
// and <Outlet /> renders the specific page (e.g., Home, Profile, Voting).
function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-grow h-screen overflow-y-auto p-6 bg-gray-100">
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <NoticeBoard />
    </div>
  );
}

// --- 2. Protected Route Component ---
// This component checks for an auth token. If it doesn't exist,
// it redirects the user to the /login page.
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the child component (in this case, our layouts)
  return <Outlet />;
}

// --- 3. Main App Component with Updated Routes ---
function App() {
  return (
    <Router>
      {/* The main wrapper div is removed from here to allow
        public pages (like LandingPage) to control their own full-screen layout.
        The layouts themselves (UserLayout) now manage their styling.
      */}
      <Routes>
        {/* === Public Routes === */}
        {/* These routes are not protected and don't have the sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* === Protected Routes === */}
        {/* All routes inside this element will check for a token first */}
        <Route element={<ProtectedRoute />}>
          
          {/* --- User Dashboard Layout --- */}
          {/* All these routes will render *inside* the UserLayout component */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} /> {/* /dashboard */}
            <Route path="profile" element={<Profile />} /> {/* /dashboard/profile */}
            <Route path="voting" element={<PollList />} /> {/* /dashboard/voting */}
            <Route path="poll/:id" element={<PollDetail />} /> {/* /dashboard/poll/123 */}
            <Route path="voting/create" element={<CreatePoll />} /> {/* /dashboard/voting/create */}
          </Route>
          
          {/* --- Admin Route --- */}
          {/* This route is also protected but uses a different element.
              You would create an "AdminLayout" for it later. */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

        </Route>

        {/* === 404 Fallback === */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-screen w-full">
              <h2 className="text-4xl font-bold">404 Not Found</h2>
              <Link to="/" className="text-blue-500 hover:underline mt-4">
                Go Home
              </Link>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;