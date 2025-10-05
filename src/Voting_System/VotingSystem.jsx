import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------------------- NavBar ----------------------
function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-gray-900 text-gray-200 shadow-md flex justify-between items-center">
      <div>
        <Link to="/" className="text-lg font-bold hover:text-white transition-colors duration-200">
          PollApp
        </Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-white transition-colors duration-200">
          Home
        </Link>
        {token ? (
          <>
            <Link to="/create" className="hover:text-white transition-colors duration-200">
              Create Poll
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-white transition-colors duration-200">
              Login
            </Link>
            <Link to="/signup" className="hover:text-white transition-colors duration-200">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ---------------------- Poll List ----------------------
function PollList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const res = await axios.get(`${API_URL}/polls`);
      setPolls(res.data);
    };
    fetchPolls();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Polls</h2>
      {polls.length === 0 && <p className="text-gray-400">No polls yet</p>}
      <ul className="space-y-2">
        {polls.map((p) => (
          <li key={p._id} className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors duration-200">
            <Link to={`/poll/${p._id}`} className="text-blue-400 hover:underline">
              {p.question}
            </Link>
            <span className="text-gray-400 text-sm ml-2">— by {p.createdBy?.name || "Unknown"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------- Poll Detail ----------------------
function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchPoll = async () => {
    const res = await axios.get(`${API_URL}/polls/${id}`);
    setPoll(res.data);
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const vote = async () => {
    if (selected === null) return alert("Select option");
    try {
      await axios.post(`${API_URL}/polls/${id}/vote`, { optionIndex: selected });
      await fetchPoll();
      alert("Voted!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error voting");
    }
  };

  if (!poll) return <div className="text-center text-gray-400">Loading...</div>;

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">{poll.question}</h2>
      <ul className="space-y-4 mb-6">
        {poll.options.map((opt, idx) => (
          <li key={idx}>
            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="opt"
                onChange={() => setSelected(idx)}
                checked={selected === idx}
                className="form-radio text-blue-500"
              />
              <span>
                {opt.text} — {opt.votes} votes
                {totalVotes > 0 ? ` (${Math.round((opt.votes / totalVotes) * 100)}%)` : ""}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={vote}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Vote
      </button>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-white">Results</h3>
      <div className="space-y-4">
        {poll.options.map((opt, idx) => (
          <div key={idx} className="bg-gray-700 p-3 rounded-md">
            <div className="flex justify-between text-gray-300">
              <span>{opt.text}</span>
              <span>
                {opt.votes} ({totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0}%)
              </span>
            </div>
            <div className="mt-2 bg-gray-600 rounded-full h-3">
              <div
                style={{ width: `${totalVotes ? (opt.votes / totalVotes) * 100 : 0}%` }}
                className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------- Create Poll ----------------------
function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const options = optionsText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (options.length < 2) return alert("Provide at least 2 options");
    try {
      await axios.post(`${API_URL}/polls`, { question, options });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating poll");
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Create Poll</h2>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <textarea
        placeholder="One option per line"
        value={optionsText}
        onChange={(e) => setOptionsText(e.target.value)}
        rows={6}
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 resize-none"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Create
      </button>
    </form>
  );
}

// ---------------------- Login ----------------------
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Login</h2>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={onChange}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Login
      </button>
    </form>
  );
}

// ---------------------- Signup ----------------------
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-4 bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Signup</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={onChange}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={onChange}
        required
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Signup
      </button>
    </form>
  );
}

// ---------------------- Main App ----------------------
export default function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mx-auto mt-6">
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}
