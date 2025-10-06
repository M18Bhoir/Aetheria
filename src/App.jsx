import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import Signup from './LoginSignUp/SignUp';
import Dashboard from './Dashboard/Dashboard';
import User_Dashboard from './UserDashBoard/User_Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/login/admin/Dashboard" element={<Dashboard />} />
          <Route path="/User_Dashboard" element={<User_Dashboard />} />
          <Route path="/login/user/Dashboard" element={<User_Dashboard/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
