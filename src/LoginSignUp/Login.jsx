import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// --- CORRECTED: Use the consistent API instance ---
import api from "../utils/api";

// Assuming image imports are correct relative to this file
import user_icon from "../Assets/person.png";
import password_icon from "../Assets/password.png";

const Signup = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // --- Use state for messages (replace alert) ---
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
     // Optional: Add password complexity check here if desired

    setLoading(true);

    try {
      // Use the configured api instance and correct path
      const res = await api.post("/api/auth/signup", {
        name,
        userId,
        password,
      });

      // Check status code for success (usually 201 Created)
      if (res.status === 201) {
         setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });
         setTimeout(() => navigate("/login"), 1500); // Redirect after delay
      } else {
         // Should not happen if backend throws errors, but good fallback
         setMessage({ type: 'error', text: res.data.message || res.data.msg || "Signup failed. Please try again." });
      }
    } catch (err) {
      console.error("Signup error:", err);
       let errorMessage = "Error during sign up. Please try again.";
       if (err.response) {
            // Use the message from the backend response
            errorMessage = err.response.data.message || err.response.data.msg || "Server error during signup.";
       } else if (err.request) {
           errorMessage = "Network error. Could not connect to the server.";
       }
       setMessage({ type: 'error', text: errorMessage });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full p-4">
      <h2 className="text-white mb-6 text-2xl font-bold">Create Account</h2>

      <div className="flex flex-col w-full max-w-sm pb-[30px] bg-[#1a1a2e] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2e2e42]">
        <div className="flex flex-col items-center gap-2.5 w-full mt-7">
          <div className="text-[#ff6347] text-4xl font-bold">Sign Up</div>
          <div className="w-[61px] h-1.5 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-[9px]" />
        </div>

        <form
          onSubmit={handleSignUp}
          className="mt-[30px] flex flex-col gap-6 px-7"
        >
         {/* Message Display Area */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm font-medium ${
                message.type === "error"
                  ? "bg-red-900 text-red-300 border border-red-700"
                  : "bg-green-900 text-green-300 border border-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Name */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={user_icon} alt="User icon" className="mx-4 h-5 w-5 invert" />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"/>
          </div>

          {/* User ID */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={user_icon} alt="ID icon" className="mx-4 h-5 w-5 invert" />
            <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} required className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"/>
          </div>

          {/* Password */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={password_icon} alt="Password icon" className="mx-4 h-5 w-5 invert" />
            <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"/>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={password_icon} alt="Password icon" className="mx-4 h-5 w-5 invert" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"/>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-[30px]">
            <button type="submit" disabled={loading} className={`flex justify-center items-center w-full h-[60px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-lg text-lg font-bold transition-all duration-300 ${ loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[0_0_15px_rgba(255,99,71,0.6)] hover:-translate-y-0.5' }`}>
             {loading ? (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>) : ('Sign Up')}
            </button>
          </div>
        </form>

        {/* Already have an account? */}
        <p className="text-gray-400 text-center mt-4 text-sm"> Already have an account?{" "} <span className="text-[#ff6347] cursor-pointer hover:underline" onClick={() => navigate("/login")}> Login </span> </p>
      </div>
    </div>
  );
};

export default Signup;
