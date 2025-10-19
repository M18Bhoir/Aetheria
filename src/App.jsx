import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import Dashboard from './Dashboard/Dashboard';
import User_Dashboard from './UserDashBoard/User_Dashboard';
import VotingSystem from './Voting_System/VotingSystem';
import Profile from './Profile/Profile';
import './index.css';
import CreatePoll from './Voting_System/CreatePoll';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/login/admin/Dashboard" element={<Dashboard />} />
          <Route path="/User_Dashboard" element={<User_Dashboard />} />
          <Route path="/login/user/Dashboard" element={<User_Dashboard />} />
          <Route path="/voting" element={<VotingSystem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/voting/CreatePoll" element={<CreatePoll/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
