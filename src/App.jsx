import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

// --- Page & Component Imports ---
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import AdminDashboard from './Dashboard/Dashboard'; // Assuming this is for Admin
import UserDashboard from './UserDashBoard/User_Dashboard'; // User's main dashboard view
import Profile from './Profile/Profile';
import { PollList, PollDetail } from './Voting_System/VotingSystem';
import CreatePoll from './Voting_System/CreatePoll';
// --- Import Booking Components ---
import AmenityBooking from './Booking/AmenityBooking';
// --- CORRECTED: Import name matches RENAMED filename ---
import MyBookings from './Booking/MyBooking';
// --- Import Marketplace Components ---
import MarketplaceList from './Marketplace/MarketplaceList';
// --- CORRECTED: Imports match RENAMED filenames ---
import MarketplaceItemDetail from './Marketplace/MarketplaceItem';
import CreateMarketplaceItem from './Marketplace/MarketplaceItemform';
import MyListings from './Marketplace/MyListingView';

// --- Layout Component Imports ---
import Sidebar from './Components/Sidebar';
// import NoticeBoard from './Components/NoticeBoard'; // Keep commented if not used

import './index.css';

// --- User Layout Component ---
function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-grow h-screen overflow-y-auto p-6">
        <Outlet />
      </main>
      {/* <NoticeBoard /> */}
    </div>
  );
}

// --- Protected Route Component ---
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// --- Main App Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* === Protected Routes === */}
        <Route element={<ProtectedRoute />}>

          {/* --- User Dashboard Layout & Routes --- */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            {/* Voting */}
            <Route path="voting" element={<PollList />} />
            <Route path="poll/:id" element={<PollDetail />} />
            <Route path="voting/create" element={<CreatePoll />} />
            {/* Booking */}
            <Route path="booking" element={<AmenityBooking />} />
            <Route path="my-bookings" element={<MyBookings />} />
            {/* Marketplace */}
            <Route path="marketplace" element={<MarketplaceList />} />
            <Route path="marketplace/new" element={<CreateMarketplaceItem />} />
            <Route path="marketplace/:itemId" element={<MarketplaceItemDetail />} />
            <Route path="my-listings" element={<MyListings />} />
            {/* Other user routes */}
          </Route>

          {/* --- Admin Route --- */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Other admin routes */}

        </Route> {/* End ProtectedRoute */}

        {/* === 404 Route === */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <Link to="/" className="text-blue-500 hover:underline">
                Go back to Landing Page
              </Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

