// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import Pages/Components
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import AdminDashboard from './Dashboard/Dashboard';
import UserDashboard from './UserDashBoard/User_Dashboard';
import Profile from './Profile/Profile';
import { PollList, PollDetail } from './Voting_System/VotingSystem';
import CreatePoll from './Voting_System/CreatePoll';
import './index.css';

function App() {
  return (
    <Router>
      {/* Basic layout wrapper */}
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Routes (Assumed protected elsewhere or unprotected for simplicity) */}
          <Route path="/User_Dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/voting" element={<PollList />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="/voting/create" element={<CreatePoll />} />

          {/* Admin Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Basic 404 Fallback */}
          <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;