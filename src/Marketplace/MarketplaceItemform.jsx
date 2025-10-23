import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const CATEGORIES = ['Furniture', 'Electronics', 'Clothing', 'Books', 'Vehicle', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Used - Good', 'Used - Fair', 'Parts Only'];

function CreateMarketplaceItem() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(CATEGORIES[5]); // Default to Other
    const [condition, setCondition] = useState(CONDITIONS[2]); // Default to Used - Good
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setMessage({ type: 'error', text: 'Please enter a valid non-negative price.' });
            setLoading(false);
            return;
        }
         // Simple URL validation
        if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
            setMessage({ type: 'error', text: 'Invalid Image URL. Must start with http:// or https://' });
             setLoading(false);
             return;
        }

        try {
            await api.post('/api/marketplace', {
                title,
                description,
                price: priceNum,
                category,
                condition,
                imageUrl,
            });
            setMessage({ type: 'success', text: 'Item listed successfully!' });
            setTimeout(() => {
                navigate('/dashboard/marketplace'); // Redirect to marketplace list
            }, 1500);

        } catch (err) {
            console.error("Error listing item:", err);
             if (err.message !== "Unauthorized access - Redirecting to login.") {
                 setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to list item.' });
             }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto dark:text-gray-100">
             <button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4">
                 <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
                 Back
             </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">List New Item</h1>

             {message.text && (
                 <div className={`mb-4 p-3 rounded-md text-sm ${
                     message.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                     'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                 }`}>
                     {message.text}
                 </div>
             )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength="100"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength="1000" rows="4"
                              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {/* Category */}
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                 {/* Condition */}
                 <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                    <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                         {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                </div>

                 {/* Image URL (Optional) */}
                 <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL (Optional)</label>
                    <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                           className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Provide a direct link to an image (e.g., Imgur, Google Photos link).</p>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading}
                        className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                        }`}
                >
                    {loading ? 'Submitting...' : 'List Item'}
                </button>
            </form>
        </div>
    );
}

export default CreateMarketplaceItem;
