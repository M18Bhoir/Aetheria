import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Use the consistent API instance - Corrected Path
import api from "/src/utils/api.jsx"; // Using absolute path from root

// Assuming image imports are correct relative to this file - Corrected Paths
import user_icon from "/src/Assets/person.png"; // Using absolute path from root
import password_icon from "/src/Assets/password.png"; // Using absolute path from root

const Login = () => {
  // State for user ID, password, messages, and loading status
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // For success/error messages
  const [loading, setLoading] = useState(false); // For loading indicator

  const navigate = useNavigate();

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setLoading(true); // Set loading state

    try {
      // Make POST request to the login endpoint
      const res = await api.post("/api/auth/login", {
        userId,
        password,
      });

      // Check status code for success (usually 200 OK)
      if (res.status === 200 && res.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user info

        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        // Redirect to the user dashboard after a short delay
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        // Handle cases where login might fail without throwing an error (less common)
        setMessage({ type: 'error', text: res.data.message || res.data.msg || "Login failed. Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Error during login. Please try again.";
      if (err.response) {
        // Use the specific error message from the backend if available
        errorMessage = err.response.data.message || err.response.data.msg || "Invalid credentials or server error.";
      } else if (err.request) {
        // Handle network errors (no response received)
        errorMessage = "Network error. Could not connect to the server.";
      }
      // Check if the error is an Axios cancellation error (ignore if so)
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setLoading(false); // Reset loading state regardless of outcome
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

          {/* User ID */}
          <div className="flex items-center mx-auto w-full h-[60px] bg-[#2e2e42] rounded-lg border border-[#444466] focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)] transition-colors duration-200">
            <img src={user_icon} alt="User ID icon" className="mx-4 h-5 w-5 invert" />
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
              {/* Show loading spinner or text */}
              {loading ? (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>) : ('Login')}
            </button>
          </div>
        </form>

        {/* Link to Sign Up Page */}
        <p className="text-gray-400 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-[#ff6347] cursor-pointer hover:underline"
            onClick={() => navigate("/signup")} // Navigate to the signup page
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

