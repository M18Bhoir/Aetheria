import React, { useState } from "react";
const useNavigate = () => (path) => {
  console.log(`[NAVIGATE MOCK] Successful login! Attempting to redirect to: ${path}`);
};

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

const UnifiedLogin = () => {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // For displaying feedback in the UI
  const [loading, setLoading] = useState(false); // For managing the button state
  
  // Initialize mock navigation
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setLoading(true);

    // Hardcoded User details
    const apiUrl = "http://localhost:5000/api/user/login";
    const successPath = "/user-dashboard";
    const roleName = "User";

    try {
      // --- START MOCK API CALL ---
      console.log(`Attempting to log in as ${roleName} to: ${apiUrl}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mocked Success/Failure Logic: Use 'user' / 'password' to succeed
      const mockSuccess = (userId === 'user' && password === 'password');

      if (mockSuccess) {
          setMessage({
              type: "success",
              text: `Login successful! Redirecting... (Mock credentials: 'user' / 'password')`
          });
          // Mock saving a token
          localStorage.setItem('userToken', 'mock-token-123-session');
          
          // Navigate after a short delay to show the success message
          setTimeout(() => navigate(successPath), 1500);
      } else {
          setMessage({
              type: "error",
              text: `Invalid User ID or Password. Please check your details.`
          });
      }
      // --- END MOCK API CALL ---

    } catch (error) {
      console.error("Login failed:", error);
      setMessage({
        type: "error",
        text: "Login failed due to a network or connection error."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1e] w-full p-4 font-sans">
      <h2 className="text-white mb-8 text-3xl font-extrabold tracking-wide">
        User Portal Login
      </h2>

      <div className="flex flex-col w-full max-w-sm pb-8 bg-[#1a1a2e] rounded-xl shadow-2xl border border-[#2e2e42] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        
        {/* Removed Role Toggle Switch */}

        <div className="flex flex-col items-center gap-2.5 w-full pt-10">
          <div className="text-[#ff6347] text-3xl font-bold uppercase">
            User Login
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-full" />
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 flex flex-col gap-5 px-7"
        >
          {/* Message Display Area (Replaces alert) */}
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

          {/* User ID Input */}
          <div className="flex items-center w-full h-[55px] bg-[#2e2e42] rounded-xl border border-[#444466] transition-all duration-300 focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <PersonIcon className="mx-4 h-5 w-5 text-[#ff6347]" />
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="h-[50px] w-full bg-transparent border-none outline-none text-white text-base rounded-xl placeholder:text-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center w-full h-[55px] bg-[#2e2e42] rounded-xl border border-[#444466] transition-all duration-300 focus-within:border-[#ff6347] focus-within:shadow-[0_0_10px_rgba(255,99,71,0.4)]">
            <LockIcon className="mx-4 h-5 w-5 text-[#ff6347]" />
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
              className={`flex justify-center items-center w-full h-[55px] text-white bg-gradient-to-r from-[#ff6347] to-[#ff9478] rounded-xl text-lg font-bold cursor-pointer border-none transition-all duration-300 ease-in-out ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-[0_0_20px_rgba(255,99,71,0.8)] hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                `Log In`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedLogin;
