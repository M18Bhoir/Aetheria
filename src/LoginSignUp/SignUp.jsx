import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import user_icon from "../Assets/person.png";
import password_icon from "../Assets/password.png";

const Signup = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // ✅ Send signup data to backend
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        userId,
        password,
      });

      if (res.data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while signing up. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full"> {/* Added w-full */}
      <h2 className="text-white mb-6 text-2xl font-bold">Create Account</h2>

      <div className="flex flex-col w-[400px] pb-[30px] bg-[#1a1a2e] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2e2e42]">
        <div className="flex flex-col items-center gap-2.5 w-full mt-7">
          <div className="text-[#ff6347] text-4xl font-bold">Sign Up</div>
          <div className="w-[61px] h-1.5 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-[9px]" />
        </div>

        <form
          onSubmit={handleSignUp}
          className="mt-[55px] flex flex-col gap-6 px-7"
        >
          {/* Name */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img src={user_icon} alt="User icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* User ID */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img src={user_icon} alt="ID icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img src={password_icon} alt="Password icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <img src={password_icon} alt="Password icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="submit-container flex justify-center mt-[30px] px-7">
            <button
              type="submit"
              className="flex justify-center items-center w-full h-[60px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-lg text-lg font-bold hover:shadow-[0_0_15px_rgba(255,99,71,0.6)] hover:-translate-y-0.5 transition"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Already have an account? */}
        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-[#ff6347] cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;