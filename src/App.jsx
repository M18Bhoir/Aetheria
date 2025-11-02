import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import AdminDashboard from './Dashboard/admin-dashboard'; 
import UserDashboard from './UserDashBoard/User_Dashboard'; 
import Profile from './Profile/Profile';
import { PollList, PollDetail } from './Voting_System/VotingSystem';
import CreatePoll from './Voting_System/CreatePoll';
import AmenityBooking from './Booking/AmenityBooking';
import MyBookings from './Booking/MyBookings';
import MarketplaceList from './Marketplace/MarketplaceList';
import MarketplaceItemDetail from './Marketplace/MarketplaceItemDetail';
import CreateMarketplaceItem from './Marketplace/MarketplaceItem'; 
import MyListings from './Marketplace/MyListings';
import Sidebar from './Components/Sidebar';
import RequestGuestPass from './Booking/RequestGuestPass';
import MyGuestPasses from './Booking/MyGuestPasses';


import './index.css';

// --- User Layout Component ---
// ... (UserLayout function is unchanged) ...
function UserLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- ADDED: Check role inside layout to enforce role-specific content ---
  const isUser = !!localStorage.getItem('user'); 
  // If an Admin somehow lands here, redirect them immediately.
  if (!isUser) {
      return <Navigate to="/admin-dashboard" replace />;
  }
  // --- END ADDED ---
  
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

// --- Protected Route Component (Simplified and Enforced) ---
// ... (ProtectedRoute function is unchanged) ...
function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('admin');
  const isUser = localStorage.getItem('user');

  if (!token) {
    // 1. Not logged in at all
    return <Navigate to="/login" replace />;
  }
  
  const pathname = window.location.pathname;

  // 2. Check Role Consistency: Ensure user lands on their correct default dashboard
  if (isAdmin && (pathname === '/dashboard' || pathname === '/')) {
      return <Navigate to="/admin-dashboard" replace />;
  }
  if (isUser && pathname === '/admin-dashboard') {
      return <Navigate to="/dashboard" replace />;
  }
  
  // 3. Fallback/Safety Check for nested routes: If Admin tries to access any /dashboard sub-route, redirect them.
  if (isAdmin && pathname.startsWith('/dashboard/')) {
      return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
}

// --- Main App Component ---
function App() {
  return (
  
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
            {/* --- 2. ADD NEW GUEST PASS ROUTES --- */}
            <Route path="request-guest-pass" element={<RequestGuestPass />} />
            <Route path="my-guest-passes" element={<MyGuestPasses />} />
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
    
  );
}

export default App;