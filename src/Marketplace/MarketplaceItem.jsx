import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"; // Icons

// Placeholder image function
const placeholderImage = (text = 'No Image') => `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(text)}`;

function MarketplaceItemDetail() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // To check ownership

    useEffect(() => {
        // Get current user info from local storage (simplified)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) { console.error("Error parsing user from storage"); }
        }

        const fetchItem = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/api/marketplace/${itemId}`);
                setItem(res.data);
            } catch (err) {
                console.error(`Failed to fetch item ${itemId}:`, err);
                if (err.message !== "Unauthorized access - Redirecting to login.") {
                     setError(err.response?.data?.message || 'Could not load item details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    const isOwner = currentUser && item && item.seller?._id === currentUser.id; // Check if current user owns the item

     const handleDelete = async () => {
        if (!isOwner) return;
        if (window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
            try {
                await api.delete(`/api/marketplace/${item._id}`);
                alert('Listing deleted successfully.');
                navigate('/dashboard/my-listings'); // Go to user's listings page
            } catch (err) {
                 console.error("Failed to delete item:", err);
                 alert(err.response?.data?.message || 'Failed to delete listing.');
            }
        }
    };


    if (loading) return <p className="text-center p-6 text-gray-500 dark:text-gray-400">Loading item details...</p>;
    if (error) return <p className="text-center p-6 text-red-500 dark:text-red-400">Error: {error}</p>;
    if (!item) return <p className="text-center p-6 text-gray-500 dark:text-gray-400">Item not found.</p>;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto dark:text-gray-100">
            <Link to="/dashboard/marketplace" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4">
                <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
                Back to Marketplace
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden md:flex">
                 {/* Image Section */}
                 <div className="md:w-1/2">
                    <img
                        src={item.imageUrl || placeholderImage(item.title)}
                        alt={item.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage(item.title); }}
                        className="w-full h-64 md:h-full object-cover"
                    />
                 </div>

                 {/* Details Section */}
                 <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            Listed on: {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                            ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        <div className="space-y-2 text-sm mb-4">
                             <p><span className="font-semibold text-gray-600 dark:text-gray-400">Category:</span> {item.category}</p>
                             <p><span className="font-semibold text-gray-600 dark:text-gray-400">Condition:</span> {item.condition}</p>
                             <p><span className="font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                                <span className={`ml-1 font-medium ${item.status === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {item.status}
                                </span>
                             </p>
                             <p><span className="font-semibold text-gray-600 dark:text-gray-400">Seller:</span> {item.seller?.name || 'Unknown'} ({item.seller?.userId || 'N/A'})</p>
                        </div>

                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap mb-6">{item.description}</p>
                    </div>

                    {/* Action Buttons */}
                     <div className="mt-auto border-t pt-4 dark:border-gray-700">
                        {isOwner ? (
                             <div className="flex space-x-2">
                                <button
                                    // onClick={() => navigate(`/dashboard/marketplace/edit/${item._id}`)} // TODO: Add edit route/component
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
                                    disabled // Temporarily disable edit
                                >
                                    <HiOutlinePencil className="h-4 w-4 mr-1"/> Edit (Coming Soon)
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                     <HiOutlineTrash className="h-4 w-4 mr-1"/> Delete
                                </button>
                             </div>
                        ) : (
                             <button
                                // onClick={() => handleContactSeller()} // TODO: Implement contact logic (e.g., show email/phone or internal message)
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Contact Seller (Feature Coming Soon)
                            </button>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
}

export default MarketplaceItemDetail;
