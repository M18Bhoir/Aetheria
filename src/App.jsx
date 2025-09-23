import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Login from './LoginSignUp/Login';
import UserLogin from './LoginSignUp/UserLogin';
import AdminLogin from './LoginSignUp/AdminLogin';
import Signup from './LoginSignUp/SignUp';
import AdminDashboard from './DashBoard/AdminDashboard/DashAdmin';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={
            <>
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 flex-1 overflow-y-auto">
                  <Dashboard />
                </main>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;