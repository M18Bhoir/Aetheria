import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f1e]">
      <h1 className="text-4xl text-white mb-10 font-bold">Choose Login</h1>
      <div className="flex gap-6">
        {/* User Login button */}
        <button
          onClick={() => navigate("/login/user")}
          className="px-6 py-3 bg-gradient-to-r from-[#ff6347] to-[#ff9478] text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          User Login
        </button>

        {/* Admin Login button */}
        <button
          onClick={() => navigate("/login/admin")}
          className="px-6 py-3 bg-[#2e2e42] text-white rounded-lg border border-[#444466] hover:border-[#ff6347] hover:shadow-md transition"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default Login;
