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
import MyBookings from './Booking/MyBooking';
// --- Import Marketplace Components ---
import MarketplaceList from './Marketplace/MarketplaceList';
import MarketplaceItemDetail from './Marketplace/MarketplaceItem';
import CreateMarketplaceItem from './Marketplace/MarketplaceItem';
import MyListings from './Marketplace/MyListingView';

// --- Layout Component Imports ---
import Sidebar from './Components/Sidebar';
// import NoticeBoard from './Components/NoticeBoard'; // Keep commented if not used

import './index.css';

// --- User Layout Component ---
// Renders Sidebar and the main content area via <Outlet>
function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  return (
    <div className="flex w-full bg-gray-100 dark:bg-gray-900 min-h-screen"> {/* Ensure min height */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {/* Main content area */}
      <main className="flex-grow h-screen overflow-y-auto p-6"> {/* Added scroll */}
        <Outlet /> {/* Child routes render here */}
      </main>
      {/* Optional Right Sidebar/NoticeBoard */}
      {/* <NoticeBoard /> */}
    </div>
  );
}

// --- Protected Route Component ---
// Checks for auth token, redirects to login if missing
function ProtectedRoute() {
  const token = localStorage.getItem('token'); // Use the standardized key 'token'

  if (!token) {
    // User not logged in, redirect to login page
    // 'replace' prevents going back to the protected route after logging in
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the nested routes (Outlet)
  return <Outlet />;
}

// --- Main App Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* === Public Routes (No Layout, No Auth) === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* === Protected Routes (Require Auth) === */}
        <Route element={<ProtectedRoute />}>

          {/* --- User Dashboard Layout & Routes --- */}
          <Route path="/dashboard" element={<UserLayout />}>
            {/* Index route for the main dashboard view */}
            <Route index element={<UserDashboard />} />
            {/* Profile Page */}
            <Route path="profile" element={<Profile />} />
            {/* Voting System Routes */}
            <Route path="voting" element={<PollList />} />
            <Route path="poll/:id" element={<PollDetail />} />
            <Route path="voting/create" element={<CreatePoll />} />
            {/* Amenity Booking Routes */}
            <Route path="booking" element={<AmenityBooking />} />
            <Route path="my-bookings" element={<MyBookings />} />
            {/* Marketplace Routes */}
            <Route path="marketplace" element={<MarketplaceList />} />
            <Route path="marketplace/new" element={<CreateMarketplaceItem />} /> {/* Route to create */}
            <Route path="marketplace/:itemId" element={<MarketplaceItemDetail />} /> {/* Route for details */}
            <Route path="my-listings" element={<MyListings />} /> {/* Route for user's listings */}

            {/* Add other user routes here (e.g., notices, complaints) */}
            {/* <Route path="notices" element={<NoticesPage />} /> */}
          </Route>

          {/* --- Admin Route (Example - Assuming separate layout/component) --- */}
          {/* Add admin-specific protection if needed */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Add other admin routes here */}

        </Route> {/* End ProtectedRoute */}

        {/* === 404 Not Found Route === */}
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

