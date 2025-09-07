import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./LoginSignUp/Login";
import UserLogin from "./LoginSignUp/UserLogin";
import AdminLogin from "./LoginSignUp/AdminLogin";
import Signup from "./LoginSignUp/SignUp";

// ✅ Import AdminDashboard
import AdminDashboard from "./DashBoard/AdminDashboard/DashAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
