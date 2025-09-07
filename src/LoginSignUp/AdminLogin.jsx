import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import admin_icon from "../Assets/person.png";
import password_icon from "../Assets/password.png";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ Send login request to backend
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        adminId,
        password,
      });

      if (response.data.success) {
        alert("Login successful!");
        // (Optional) Save token if backend sends one
        if (response.data.token) {
          localStorage.setItem("adminToken", response.data.token);
        }
        // Redirect to admin dashboard
        navigate("/admin-dashboard");
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials or try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e]">
      <h2 className="text-white mb-6 text-2xl font-bold">Admin Login</h2>

      <div className="flex flex-col w-[400px] pb-[30px] bg-[#1a1a2e] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2e2e42]">
        <div className="flex flex-col items-center gap-2.5 w-full mt-7">
          <div className="text-[#ff6347] text-4xl font-bold">Login</div>
          <div className="w-[61px] h-1.5 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-[9px]" />
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-[55px] flex flex-col gap-6 px-7"
        >
          {/* Admin ID Input */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] transition-all duration-300 ease-in-out focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img
              src={admin_icon}
              alt="Admin icon"
              className="mx-4 h-5 w-5 invert"
            />
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent border-none outline-none text-white text-lg rounded-lg placeholder:text-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] transition-all duration-300 ease-in-out focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img
              src={password_icon}
              alt="Password icon"
              className="mx-4 h-5 w-5 invert"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent border-none outline-none text-white text-lg rounded-lg placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-[30px] px-7">
            <button
              type="submit"
              className="flex justify-center items-center w-full h-[60px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-lg text-lg font-bold cursor-pointer border-none transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(255,99,71,0.6)] hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
