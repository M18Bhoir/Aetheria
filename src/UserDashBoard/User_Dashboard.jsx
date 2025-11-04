import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
    DollarSign, 
    CheckCircle, 
    AlertTriangle, 
    Vote, 
    Calendar, 
    CalendarCheck,
    ShoppingCart, 
    List, 
    User,
    ArrowRight,
    Bell 
} from 'lucide-react';
// Make sure you have created this file
import { loadScript } from '../utils/loadScript'; 

// --- (DashboardCard component is unchanged) ---
const DashboardCard = ({ title, description, icon, path }) => {
    const navigate = useNavigate();
    
    return (
        <button
            onClick={() => navigate(path)}
            className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
        >
            <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                    {icon}
                </div>
                <ArrowRight className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
            </p>
        </button>
    );
};

// --- Notice Board Component ---
const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // Use the new '/api/notices/user' route
        const res = await api.get('/api/notices/user');
        setNotices(res.data.slice(0, 3)); // Show top 3 notices
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
     <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notice Board</h3>
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading notices...</p>}
        {!loading && notices.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No notices posted.</p>
        )}
        {!loading && notices.length > 0 && (
             <ul className="space-y-3">
                {notices.map((notice) => (
                    <li key={notice._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{notice.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Posted on: {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{notice.body}</p>
                    </li>
                ))}
            </ul>
        )}
     </div>
  );
};


// --- UPDATED MAIN DASHBOARD ---
function User_Dashboard() {
  const [dues, setDues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  useEffect(() => {
     const storedUser = localStorage.getItem('user');
     if (storedUser) {
       try {
         const parsedUser = JSON.parse(storedUser);
         setUserData(parsedUser);
       } catch (e) { console.error(e); }
     }

    const initializePage = async () => {
      setIsLoading(true); 
      setError(null);
      try {
        const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!scriptLoaded) {
            throw new Error('Payment script failed to load.');
        }
        const duesRes = await api.get('/api/user/dues'); 
        setDues(duesRes.data.dues); 
        setIsPaymentReady(true);
      } catch (err) {
        console.error("Failed to initialize page:", err);
         if (err.message !== "Unauthorized access - Redirecting to login.") { 
             setError(err.response?.data?.message || err.response?.data?.msg || "Could not load your dashboard data.");
         }
      } finally {
        setIsLoading(false);
      }
    };
    initializePage();
  }, []); 

  const handlePayment = async (dueInfo) => {
    if (!isPaymentReady || !window.Razorpay) {
        alert("Payment service is not ready. Please wait a moment and try again.");
        return;
    }
    if (!dueInfo || dueInfo.amount <= 0) {
        alert("No outstanding dues to pay.");
        return;
    }

    try {
        const { data: { keyId } } = await api.get('/api/payment/get-key');
        if (!keyId) {
             alert("Payment service is currently unavailable.");
             return;
        }
        
        const { data: order } = await api.post('/api/payment/create-order', {
            amount: dueInfo.amount
        });

        const options = {
            key: keyId,
            amount: order.amount,
            currency: order.currency,
            name: "Aetheria Society",
            description: "Society Dues Payment",
            order_id: order.id,
            
            handler: async function (response) {
                try {
                    const verificationData = {
                        order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    
                    const res = await api.post('/api/payment/verify-payment', verificationData);

                    if (res.data.success) {
                        alert("Payment successful!");
                        const duesRes = await api.get('/api/user/dues'); 
                        setDues(duesRes.data.dues); 
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                } catch (err) {
                     alert("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: userData.name || "Resident",
                email: userData.email || "",
            },
            theme: {
                color: "#3399cc" 
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal dismissed');
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', function (response){
                console.error('Payment failed:', response.error);
                alert("Payment failed: " + response.error.description);
        });

    } catch (err) {
        console.error("Payment initiation failed:", err);
        alert("Failed to start payment. Please try again.");
    }
  };


  const actions = [
    {
      title: "Voting System",
      description: "Cast your vote in active society polls.",
      icon: <Vote size={28} />,
      path: "/dashboard/voting"
    },
    {
      title: "Book an Amenity",
      description: "Reserve the clubhouse, pool, or tennis court.",
      icon: <Calendar size={28} />,
      path: "/dashboard/booking"
    },
    {
      title: "My Bookings",
      description: "View and manage your upcoming reservations.",
      icon: <CalendarCheck size={28} />,
      path: "/dashboard/my-bookings"
    },
    {
      title: "Marketplace",
      description: "Buy and sell items within the community.",
      icon: <ShoppingCart size={28} />,
      path: "/dashboard/marketplace"
    },
    {
      title: "My Listings",
      description: "Manage the items you are currently selling.",
      icon: <List size={28} />,
      path: "/dashboard/my-listings"
    },
    {
      title: "My Profile",
      description: "Update your contact information and details.",
      icon: <User size={28} />,
      path: "/dashboard/profile"
    }
  ];

  // --- THIS IS THE MISSING FUNCTION ---
  const getDuesCardStyle = () => {
      if (!dues || dues.status === 'Paid') {
          return {
              bg: 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700',
              iconBg: 'bg-green-100 dark:bg-green-800',
              icon: <CheckCircle size={28} className="text-green-600 dark:text-green-300" />,
              textColor: 'text-green-700 dark:text-green-300',
              amountColor: 'text-green-600 dark:text-green-300'
          };
      }
      if (dues.status === 'Overdue') {
           return {
              bg: 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700',
              iconBg: 'bg-red-100 dark:bg-red-800',
              icon: <AlertTriangle size={28} className="text-red-600 dark:text-red-300" />,
              textColor: 'text-red-700 dark:text-red-300',
              amountColor: 'text-red-600 dark:text-red-300'
          };
      }
       // Default (Pending)
       return {
            bg: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700',
            iconBg: 'bg-yellow-100 dark:bg-yellow-800',
            icon: <DollarSign size={28} className="text-yellow-600 dark:text-yellow-300" />,
            textColor: 'text-yellow-700 dark:text-yellow-300',
            amountColor: 'text-yellow-600 dark:text-yellow-300'
        };
  };
  // --- END OF MISSING FUNCTION ---

  const duesStyle = getDuesCardStyle();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Welcome, {userData.name || 'User'}!
      </h1>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* --- DUES CARD --- */}
        <div className={`p-6 rounded-lg shadow-lg border ${duesStyle.bg} flex flex-col justify-between`}>
            <div>
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${duesStyle.iconBg} mr-4`}>
                        {duesStyle.icon}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Maintenance Dues
                        </h3>
                        {isLoading && <p className="text-gray-500 dark:text-gray-400">Loading dues...</p>}
                        {error && <p className="text-red-500 dark:text-red-400">Error</p>}
                        {!isLoading && !error && dues && (
                            <>
                                <p className={`text-3xl font-bold ${duesStyle.amountColor}`}>
                                    ₹{dues.amount.toLocaleString('en-IN')}
                                </p>
                                <span className={`text-sm font-semibold ${duesStyle.textColor}`}>
                                    Status: {dues.status}
                                </span>
                                {dues.dueDate && dues.status !== 'Paid' && (
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Due: {new Date(dues.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* --- "PAY NOW" BUTTON --- */}
            {!isLoading && !error && dues && dues.status !== 'Paid' && (
                <button
                    onClick={() => handlePayment(dues)}
                    disabled={!isPaymentReady} // <-- IMPORTANT
                    className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed" // <-- Style for disabled
                >
                    {isPaymentReady ? 'Pay Now' : 'Loading Payment...'}
                </button>
            )}
        </div>
        
        {/* --- NOTICE BOARD CARD (spans 2 columns) --- */}
        <div className="lg:col-span-2">
            <UserNoticeBoard />
        </div>
      </div>

      {/* --- Quick Actions Section --- */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
            <DashboardCard 
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                path={action.path}
            />
        ))}
      </div>
    </div>
  );
}

export default User_Dashboard;