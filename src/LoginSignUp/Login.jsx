import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// --- UPDATED: Use relative path ---
import api from "../utils/api.jsx"; 

// --- UPDATED: Use relative paths ---
import user_icon from "../Assets/person.png"; 
import password_icon from "../Assets/password.png"; 

const Login = () => {
  // State for user ID, password, messages, and loading status
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // For success/error messages
  const [loading, setLoading] = useState(false); // For loading indicator

  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null); 
    setLoading(true);

    try {
      let res;
      let loginEndpoint = "";
      let payload = {};
      let successRedirect = "";
      let storageKey = "";

      if (loginType === "admin") {
        // --- Admin Login Logic ---
        loginEndpoint = "/api/admin/login";
        // --- Use state variables (Fixed) ---
        payload = { adminId: userId, password: password }; 
        successRedirect = "/admin-dashboard";
        storageKey = "admin";
      } else {
        // --- User Login Logic ---
        loginEndpoint = "/api/auth/login";
        payload = { userId, password };
        successRedirect = "/dashboard";
        storageKey = "user";
      }

      // Make the API call
      res = await api.post(loginEndpoint, payload);

      if (res.status === 200 && res.data.token) {
        // Store token (same for both)
        localStorage.setItem("token", res.data.token);
        
        // Store user or admin data
        const dataToStore = (loginType === 'admin') ? res.data.admin : res.data.user;
        localStorage.setItem(storageKey, JSON.stringify(dataToStore)); 

        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        
        // Redirect to the correct dashboard
        setTimeout(() => navigate(successRedirect), 1000);
      } else {
        setMessage({ type: 'error', text: res.data.message || res.data.msg || "Login failed. Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Error during login. Please try again.";
      if (err.response) {
        errorMessage = err.response.data.message || err.response.data.msg || "Invalid credentials or server error.";
      } else if (err.request) {
        errorMessage = "Network error. Could not connect to the server.";
      }
      
      // Clear all auth keys on failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full p-4">
      <h2 className="text-white mb-6 text-2xl font-bold">Account Login</h2>

      <div className="flex flex-col w-full max-w-sm pb-[30px] bg-[#1a1a2e] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2e2e42]">
        <div className="flex flex-col items-center gap-2.5 w-full mt-7">
          <div className="text-[#ff6347] text-4xl font-bold">Login</div>
          <div className="w-[61px] h-1.5 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-[9px]" />
        </div>

        <form
          onSubmit={handleLogin}
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

          {/* --- 2. ADD LOGIN TYPE TOGGLE --- */}
          <div className="flex justify-center gap-2">
            <button
              type="button" 
              onClick={() => setLoginType('user')}
              className={`px-4 py-2 w-full rounded-md text-sm font-medium transition-colors ${
                loginType === 'user'
                  ? 'bg-gradient-to-r from-[#ff6347] to-[#ff9478] text-white shadow-lg'
                  : 'bg-[#2e2e42] text-gray-400 hover:bg-[#444466]'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`px-4 py-2 w-full rounded-md text-sm font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-[#ff6347] to-[#ff9478] text-white shadow-lg'
                  : 'bg-[#2e2e42] text-gray-400 hover:bg-[#444466]'
              }`}
            >
              Admin
            </button>
          </div>
          {/* --- END OF TOGGLE --- */}


          {/* User ID / Admin ID */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={user_icon} alt="User ID icon" className="mx-4 h-5 w-5 invert" />
            <input
              type="text"
              // Dynamic placeholder based on loginType
              placeholder={loginType === 'user' ? 'User ID' : 'Admin ID'} 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent text-white text-lg placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
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

          {/* Submit Button */}
          <div className="flex justify-center mt-[30px]">
            <button
              type="submit"
              disabled={loading}
              className={`flex justify-center items-center w-full h-[60px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-lg text-lg font-bold transition-all duration-300 ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[0_0_15px_rgba(255,99,71,0.6)] hover:-translate-y-0.5'
              }`}
            >
              {loading ? (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>) : ('Login')}
            </button>
          </div>
        </form>

        {/* Link to Sign Up Page */}
        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-[#ff6347] cursor-pointer hover:underline"
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