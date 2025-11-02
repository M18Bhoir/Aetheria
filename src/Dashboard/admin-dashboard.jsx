import React, { useState, useEffect } from "react";
import {
  Clock,
  Bell,
  Users,
  Wrench,
  ClipboardList,
  Menu,
  X,
  Home,
  DollarSign, 
  UserPlus,   
  AlertCircle, 
  CheckCircle, 
  LogOut,      
  ArrowLeft,
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  CalendarCheck // <-- 1. IMPORT NEW ICON
} from "lucide-react";
import { 
  BarChart, 
  PieChart, 
  Bar, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'; 
import { useNavigate } from "react-router-dom"; 
import api from "../utils/api"; 

// ----------------- Sidebar -----------------
const Sidebar = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menu = [
    { name: "Dashboard", icon: <Home size={20} />, view: "dashboard" },
    { name: "Residents", icon: <Users size={20} />, view: "residents" },
    { name: "Create Dues", icon: <DollarSign size={20} />, view: "create_dues" },
    { name: "Manage Bookings", icon: <CalendarCheck size={20} />, view: "manage_bookings" }, // <-- 2. ADD TO MENU
    { name: "Complaints", icon: <ClipboardList size={20} />, view: "complaints" },
    { name: "Maintenance", icon: <Wrench size={20} />, view: "maintenance" },
    { name: "Notices", icon: <Bell size={20} />, view: "notices" },
  ];

  const NavItem = ({ item }) => {
    const isActive = currentView === item.view;
    return (
      <button
        key={item.name}
        onClick={() => setView(item.view)}
        className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200
          ${isOpen ? "px-4" : "justify-center"}
          ${isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
      >
        {item.icon}
        {isOpen && <span className="font-medium">{item.name}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"}
        bg-gray-900 dark:bg-slate-900 text-gray-200 shadow-lg 
        transition-all duration-300 h-screen flex flex-col relative`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <div className="text-xl font-bold text-white">🏢 Admin</div>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav className="flex-1 space-y-2 p-3">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-900 hover:text-red-300
            ${isOpen ? "px-4" : "justify-center"}`}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

// ----------------- (All other components remain the same) -----------------
// StatsCards, ActivityFeed, DuesBarChart, ComplaintsPieChart,
// MaintenanceSummary, Notices, ComplaintTracker, VisitorLogs, DashboardHome, CreateDues
// ... (Paste all those components here without any changes) ...
// ----------------- StatsCards -----------------
// (No changes to this component)
const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex items-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
        >
          <div className={`p-4 rounded-full ${stat.iconBg} ${stat.iconColor} mr-4`}>
            {stat.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------- ActivityFeed -----------------
// (No changes to this component)
const icons = { Bell, Users, Wrench };
const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Activity Feed</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = icons[activity.icon];
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-3 rounded-full ${activity.bgColor} ${activity.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activity.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activity.description}
                </p>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <Clock className="w-3 h-3 mr-1.5" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------- DuesBarChart Component -----------------
// (No changes to this component)
const DuesBarChart = ({ summary }) => {
  const collectedNum = parseFloat(summary.collected.replace('₹', '').replace(',', ''));
  const pendingNum = parseFloat(summary.pending.replace('₹', '').replace(',', ''));
  
  const data = [
    { name: 'Collected', Amount: collectedNum, fill: '#16a34a' }, 
    { name: 'Pending', Amount: pendingNum, fill: '#dc2626' } 
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg" style={{ height: '350px' }}>
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Dues Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#cbd5e1' }}
            itemStyle={{ color: '#e2e8f0' }}
            cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}
          />
          <Bar dataKey="Amount">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ----------------- ComplaintsPieChart Component -----------------
// (No changes to this component)
const ComplaintsPieChart = ({ complaints }) => {
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  
  const data = [
    { name: 'Pending', value: pending },
    { name: 'Resolved', value: resolved }
  ];
  
  const COLORS = ['#dc2626', '#16a34a']; // Red, Green

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg" style={{ height: '350px' }}>
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Complaints Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


// ----------------- MaintenanceSummary -----------------
// (No changes to this component)
const MaintenanceSummary = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Maintenance Summary</h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Collected</p>
          <p className="text-2xl font-semibold text-green-600">{summary.collected}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
          <p className="text-2xl font-semibold text-red-600">{summary.pending}</p>
        </div>
      </div>
    </div>
  );
};

// ----------------- Notices -----------------
// (No changes to this component)
const Notices = ({ notices }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notices</h3>
      <ul className="space-y-3">
        {notices.map((n, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{n.date}:</span> {n.msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----------------- ComplaintTracker -----------------
// (No changes to this component)
const ComplaintTracker = ({ complaints }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Complaint Tracker</h3>
      <table className="w-full text-sm">
        <thead className="border-b dark:border-slate-700">
          <tr className="text-left text-slate-500 dark:text-slate-400">
            <th className="pb-2">Flat</th>
            <th className="pb-2">Issue</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, i) => (
            <tr
              key={i}
              className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{c.flat}</td>
              <td className="py-3 text-gray-600 dark:text-gray-300">{c.issue}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.status === "Pending" 
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                }`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ----------------- VisitorLogs -----------------
// (No changes to this component)
const VisitorLogs = ({ visitors }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Visitor Logs</h3>
      <ul className="space-y-3">
        {visitors.map((v, i) => (
          <li key={i} className="flex justify-between text-sm items-center">
            <div>
              <span className="font-medium text-gray-800 dark:text-gray-200">{v.name}</span>
              <span className="text-slate-500 dark:text-slate-400"> ({v.purpose})</span>
            </div>
            <span className="text-slate-400 text-xs">{v.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----------------- Dashboard Home View -----------------
// (No changes to this component)
const DashboardHome = () => {
  const stats = [
    { title: "Residents", value: "120", icon: <Users size={24} />, iconBg: "bg-blue-100 dark:bg-blue-900", iconColor: "text-blue-600 dark:text-blue-400" },
    { title: "Visitors Today", value: "34", icon: <UserPlus size={24} />, iconBg: "bg-green-100 dark:bg-green-900", iconColor: "text-green-600 dark:text-green-400" },
    { title: "Complaints Pending", value: "5", icon: <AlertCircle size={24} />, iconBg: "bg-red-100 dark:bg-red-900", iconColor: "text-red-600 dark:text-red-400" },
    { title: "Notices Issued", value: "3", icon: <Bell size={24} />, iconBg: "bg-yellow-100 dark:bg-yellow-900", iconColor: "text-yellow-600 dark:text-yellow-400" },
  ];
  const activities = [
    { id: 1, icon: "Bell", title: "New Notice Posted", description: "Annual meeting scheduled", time: "2h ago", bgColor: "bg-blue-100 dark:bg-blue-900", color: "text-blue-600 dark:text-blue-400" },
    { id: 2, icon: "Users", title: "Visitor Logged", description: "John entered the premises", time: "4h ago", bgColor: "bg-green-100 dark:bg-green-900", color: "text-green-600 dark:text-green-400" },
    { id: 3, icon: "Wrench", title: "Maintenance Work", description: "Lift maintenance ongoing", time: "6h ago", bgColor: "bg-yellow-100 dark:bg-yellow-900", color: "text-yellow-600 dark:text-yellow-400" },
  ];
  const summary = { collected: "₹50,000", pending: "₹10,000" };
  const notices = [
    { date: "Oct 25", msg: "Annual General Body Meeting on Nov 10." },
    { date: "Oct 20", msg: "Painting work for Tower A starts next week." },
  ];
  const complaints = [
    { flat: "A-101", issue: "Lift not working", status: "Pending" },
    { flat: "B-205", issue: "Water leakage", status: "Resolved" },
    { flat: "C-302", issue: "No power in common area", status: "Pending" },
  ];
  const visitors = [
    { name: "Suresh", purpose: "Delivery", time: "10:30 AM" },
    { name: "Priya", purpose: "Guest", time: "09:45 AM" },
    { name: "Ramesh", purpose: "Service", time: "08:15 AM" },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <DuesBarChart summary={summary} />
        <ComplaintsPieChart complaints={complaints} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActivityFeed activities={activities} />
        <MaintenanceSummary summary={summary} />
        <Notices notices={notices} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ComplaintTracker complaints={complaints} />
        <VisitorLogs visitors={visitors} />
      </div>
    </>
  );
}

// ----------------- Create Dues View -----------------
// (No changes to this component)
const CreateDues = ({ setView }) => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('Maintenance');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/api/admin/dues', {
        userId,
        amount: parseFloat(amount),
        dueDate,
        type,
        notes
      });
      setMessage({ type: 'success', text: 'Due created successfully!' });
      setUserId('');
      setAmount('');
      setDueDate('');
      setNotes('');
    } catch (err) {
      console.error("Error creating due:", err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to create due.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => setView('dashboard')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Due</h2>
        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm ${
            message.type === 'error' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          }`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID (e.g., A-101)
            </label>
            <input
              type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A-101"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (₹)
            </label>
            <input
              type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
              min="0" step="0.01"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2500"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              id="type" value={type} onChange={(e) => setType(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event</option>
              <option value="Penalty">Penalty</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="e.g., For October 2025"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500`}
          >
            {loading ? 'Submitting...' : 'Create Due'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ----------------- ResidentList Component -----------------
// (No changes to this component)
const ResidentList = ({ setView }) => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/admin/residents');
        setResidents(res.data);
      } catch (err) {
        console.error("Error fetching residents:", err);
        setError(err.response?.data?.msg || "Failed to fetch residents.");
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => setView('dashboard')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Residents</h2>
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading residents...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Name</th>
                  <th className="pb-3 p-2">User ID / Flat No.</th>
                  <th className="pb-3 p-2">Email</th>
                  <th className="pb-3 p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{user.userId}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{user.email || 'N/A'}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------- 3. CREATE NEW COMPONENT: ManageBookings -----------------
const ManageBookings = ({ setView }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to format date/time
  const formatDateTime = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleString('en-IN', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
      });
  };

  // Helper for status colors
  const getStatusColor = (status) => {
      switch (status) {
          case 'Approved': return 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600';
          case 'Pending': return 'text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600';
          case 'Rejected': return 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-600';
          case 'Cancelled': return 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500';
          default: return 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      }
  };

  // 1. Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/bookings/all');
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.msg || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // 2. Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Send update to backend
      const res = await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      
      // Update local state to show the change immediately
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b._id === bookingId ? res.data : b // res.data is the updated booking from the server
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again."); // Simple alert for error
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => setView('dashboard')} 
        className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Amenity Bookings</h2>

        {loading && <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>}
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b dark:border-slate-700">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-3 p-2">Amenity</th>
                  <th className="pb-3 p-2">User (Flat)</th>
                  <th className="pb-3 p-2">Event</th>
                  <th className="pb-3 p-2">Start Time</th>
                  <th className="pb-3 p-2">End Time</th>
                  <th className="pb-3 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-3 p-2 font-medium text-gray-800 dark:text-gray-200">{booking.amenityName}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">
                      {booking.bookedBy?.name} ({booking.bookedBy?.userId || 'N/A'})
                    </td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{booking.eventDescription}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{formatDateTime(booking.startTime)}</td>
                    <td className="py-3 p-2 text-gray-600 dark:text-gray-300">{formatDateTime(booking.endTime)}</td>
                    <td className="py-3 p-2 text-center">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-xs p-1.5 rounded border dark:bg-slate-700 font-medium ${getStatusColor(booking.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


// ----------------- Main AdminDashboard Component -----------------
// (This component is updated to render the new ManageBookings view)
const AdminDashboard = () => {
  const [view, setView] = useState("dashboard"); // 'dashboard', 'create_dues', etc.

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 space-y-6 p-6 overflow-y-auto">
        {view === "dashboard" && <DashboardHome />}
        {view === "create_dues" && <CreateDues setView={setView} />}
        {view === "residents" && <ResidentList setView={setView} />}
        {view === "manage_bookings" && <ManageBookings setView={setView} />} {/* <-- 4. ADD VIEW RENDER */}
        
        {/* Updated catch-all for "coming soon" pages */}
        {view !== "dashboard" && 
         view !== "create_dues" && 
         view !== "residents" &&
         view !== "manage_bookings" && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{view.replace('_', ' ')}</h2>
                <p>This feature is coming soon.</p>
                <button 
                    onClick={() => setView('dashboard')} 
                    className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Dashboard
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;