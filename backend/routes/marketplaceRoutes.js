import express from 'express';
import MarketplaceItem from '../models/MarketplaceItem.js';
import User from '../models/User.js'; // To populate seller info
import protect from '../middleware/auth.js'; // Authentication middleware

const router = express.Router();

// --- GET /api/marketplace ---
// Get all available marketplace items (publicly accessible or protected)
// Added simple pagination (limit, skip) and sorting
router.get('/', protect, async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default 10 items per page
    const page = parseInt(req.query.page) || 1;   // Default page 1
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt'; // Default sort by creation date
    const order = req.query.order === 'asc' ? 1 : -1; // Default descending order

    try {
        const query = { status: 'Available' }; // Only show available items by default

        // Optional: Add filtering by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        const items = await MarketplaceItem.find(query)
            .populate('seller', 'name userId') // Populate seller's name and userId
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        const totalItems = await MarketplaceItem.countDocuments(query); // Get total count for pagination info

        res.json({
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems
        });
    } catch (err) {
        console.error('Error fetching marketplace items:', err.message);
        res.status(500).json({ message: 'Server error fetching items' });
    }
});

// --- GET /api/marketplace/my ---
// Get items listed by the logged-in user
router.get('/my', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await MarketplaceItem.find({ seller: userId })
                                           .sort({ createdAt: -1 }); // Show newest first
        res.json(items);
    } catch (err) {
        console.error('Error fetching user marketplace items:', err.message);
        res.status(500).json({ message: 'Server error fetching your listings' });
    }
});

// --- GET /api/marketplace/:id ---
// Get a single marketplace item by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id)
                                         .populate('seller', 'name userId'); // Populate seller info
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error(`Error fetching item ${req.params.id}:`, err.message);
         if (err.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid item ID format' });
         }
        res.status(500).json({ message: 'Server error fetching item details' });
    }
});

// --- POST /api/marketplace ---
// Create a new marketplace listing (requires login)
router.post('/', protect, async (req, res) => {
    const { title, description, price, category, condition, imageUrl } = req.body;
    const sellerId = req.user.id; // Get seller ID from authenticated user

    // Basic validation
    if (!title || !description || price === undefined || price === null) {
        return res.status(400).json({ message: 'Title, description, and price are required.' });
    }
    if (price < 0) {
        return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    // Simple URL validation if imageUrl is provided
    if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
        return res.status(400).json({ message: 'Invalid Image URL format. Must start with http:// or https://' });
    }


    try {
        const newItem = new MarketplaceItem({
            title,
            description,
            price,
            category: category || 'Other', // Use default if not provided
            condition: condition || 'Used - Good', // Use default if not provided
            imageUrl,
            seller: sellerId,
            status: 'Available' // Default status
        });

        const savedItem = await newItem.save();
        // Populate seller info for the response
        const populatedItem = await MarketplaceItem.findById(savedItem._id)
                                                  .populate('seller', 'name userId');

        res.status(201).json(populatedItem);
    } catch (err) {
        console.error('Error creating marketplace item:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error creating listing' });
    }
});

// --- PUT /api/marketplace/:id ---
// Update a marketplace listing (only seller can update)
router.put('/:id', protect, async (req, res) => {
    const { title, description, price, category, condition, imageUrl, status } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    // Build update object dynamically based on provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) {
         if (price < 0) return res.status(400).json({ message: 'Price cannot be negative.' });
         updateFields.price = price;
    }
    if (category !== undefined) updateFields.category = category;
    if (condition !== undefined) updateFields.condition = condition;
    if (imageUrl !== undefined) {
         if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
             return res.status(400).json({ message: 'Invalid Image URL format.' });
         }
         updateFields.imageUrl = imageUrl;
    }
     if (status !== undefined) {
        if (!['Available', 'Sold', 'Reserved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }
        updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    try {
        let item = await MarketplaceItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the logged-in user is the seller
        if (item.seller.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized to update this item' });
        }

        // Apply updates
        item = await MarketplaceItem.findByIdAndUpdate(itemId, { $set: updateFields }, { new: true, runValidators: true })
                                   .populate('seller', 'name userId'); // Re-populate after update

        res.json(item);
    } catch (err) {
        console.error(`Error updating item ${itemId}:`, err);
         if (err.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid item ID format' });
         }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error updating item' });
    }
});

// --- DELETE /api/marketplace/:id ---
// Delete a marketplace listing (only seller can delete)
router.delete('/:id', protect, async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
        const item = await MarketplaceItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the logged-in user is the seller
        if (item.seller.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this item' });
        }

        await MarketplaceItem.findByIdAndDelete(itemId);

        res.json({ message: 'Item removed successfully' });
    } catch (err) {
        console.error(`Error deleting item ${itemId}:`, err.message);
         if (err.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid item ID format' });
         }
        res.status(500).json({ message: 'Server error deleting item' });
    }
});


export default router;
