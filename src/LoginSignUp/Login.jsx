// src/LoginSignUp/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Corrected import path

// Lucide Icon components (keep as they are)
const PersonIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);


const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUserId("");
    setPassword("");
    setMessage(null);
  }, [isUserLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const roleName = isUserLogin ? "user" : "admin";
    // Ensure these paths match your backend routes EXACTLY
    const apiUrlPath = isUserLogin ? "/api/auth/login" : "/api/admin/login";
    // Corrected navigation path for user
    const successPath = isUserLogin ? "/dashboard" : "/admin-dashboard";
    const idField = isUserLogin ? 'userId' : 'adminId';

    try {
      console.log(`Attempting to log in as ${roleName} to: ${apiUrlPath}`);

      const payload = {
          [idField]: userId,
          password: password
      };
      console.log("Sending payload:", payload);

      // Use the configured api instance
      const response = await api.post(apiUrlPath, payload);
      const data = response.data;

      if (data.token) {
        const token = data.token;
        setMessage({ type: "success", text: `Login successful! Redirecting...` });
        localStorage.setItem('token', token); // Use standardized key

        // Store user/admin info if provided
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        else if (data.admin) localStorage.setItem('admin', JSON.stringify(data.admin));

        // Correct navigation path
        setTimeout(() => navigate(successPath), 1000);

      } else {
         console.error("Login response missing token:", data);
         setMessage({ type: "error", text: "Login failed: No token received." });
      }

    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please try again.";
       if (error.response) {
            errorMessage = error.response.data.message || error.response.data.msg || `Invalid ${roleName} ID or Password.`; // Accept 'msg' or 'message'
            console.error('Server responded with error:', error.response.status, error.response.data);
       } else if (error.request) {
           errorMessage = "Network error. Could not connect to the server.";
           console.error('Network error:', error.request);
       } else if (error.message === "Unauthorized access - Redirecting to login.") {
           // This specific error comes from our interceptor, avoid double messaging
           errorMessage = null; // Let the interceptor handle the redirect without a message here
       } else {
           errorMessage = `An unexpected error occurred: ${error.message}`;
           console.error('Error setting up request:', error.message);
       }
       if (errorMessage) { // Only set message if it's not handled by interceptor redirect
           setMessage({ type: "error", text: errorMessage });
       }
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = isUserLogin ? '#ff6347' : '#4d94ff';
  const secondaryColor = isUserLogin ? '#ff9478' : '#78b1ff';

  // --- JSX remains the same ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full p-4 font-sans">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <h2 className="text-white mb-8 text-3xl font-extrabold tracking-wide">
        Secure Login Portal
      </h2>

      <div className="flex flex-col w-full max-w-sm pb-8 bg-[#1a1a2e] rounded-xl shadow-2xl border border-[#2e2e42] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">

        {/* Role Toggle Switch */}
        <div className="w-full flex justify-center mt-5">
          <div className="relative inline-flex items-center rounded-full p-1 cursor-pointer bg-[#2e2e42] transition-all duration-300">
            {/* Sliding Highlight */}
            <div
              className={`absolute top-1 left-1 w-1/2 h-8 rounded-full shadow-md transition-transform duration-300 ease-in-out`}
              style={{
                transform: isUserLogin ? 'translateX(0)' : 'translateX(100%)',
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
            ></div>

            <button
              onClick={() => setIsUserLogin(true)}
              className={`relative px-6 py-2 rounded-full font-bold text-sm transition-colors duration-300 z-10 ${
                isUserLogin ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setIsUserLogin(false)}
              className={`relative px-6 py-2 rounded-full font-bold text-sm transition-colors duration-300 z-10 ${
                !isUserLogin ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Dynamic Header */}
        <div className="flex flex-col items-center gap-2.5 w-full pt-10">
          <div className="text-3xl font-bold uppercase" style={{ color: primaryColor }}>
            {isUserLogin ? 'User' : 'Admin'} Login
          </div>
          <div
            className="w-12 h-1 rounded-full"
            style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 flex flex-col gap-5 px-7"
        >
          {/* Message Display Area */}
          {message && (
            <div
              className={`p-3 rounded-xl text-sm font-medium animate-fadeIn ${
                message.type === "error"
                  ? "bg-red-900 text-red-300 border border-red-700"
                  : "bg-green-900 text-green-300 border border-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* User ID / Admin ID Input */}
          <div className="flex items-center w-full h-[55px] bg-[#2e2e42] rounded-xl border border-[#444466] transition-all duration-300 focus-within:border-current focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]" style={{ borderColor: primaryColor }}>
            <PersonIcon className="mx-4 h-5 w-5" style={{ color: primaryColor }}/>
            <input
              type="text"
              placeholder={`${isUserLogin ? 'User' : 'Admin'} ID`}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent border-none outline-none text-white text-base rounded-xl placeholder:text-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center w-full h-[55px] bg-[#2e2e42] rounded-xl border border-[#444466] transition-all duration-300 focus-within:border-current focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]" style={{ borderColor: primaryColor }}>
            <LockIcon className="mx-4 h-5 w-5" style={{ color: primaryColor }}/>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent border-none outline-none text-white text-base rounded-xl placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              disabled={loading}
              className={`flex justify-center items-center w-full h-[55px] text-white rounded-xl text-lg font-bold cursor-pointer border-none transition-all duration-300 ease-in-out ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5"
              }`}
              style={{
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                boxShadow: loading ? 'none' : `0 0 20px rgba(${isUserLogin ? '255,99,71' : '77,148,255'}, 0.4)`
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                `Log In`
              )}
            </button>
          </div>
        </form>

        {/* Signup Link */}
         <p className="text-gray-400 text-center mt-6 text-sm">
           Don't have an account?{" "}
           <span
             className="cursor-pointer hover:underline"
             style={{ color: primaryColor }}
             onClick={() => navigate("/signup")}
           >
             Sign Up
           </span>
         </p>
      </div>
    </div>
  );
};

export default Login;