import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js'; // Needed to populate user info
import protect from '../middleware/auth.js'; // Middleware to protect routes

const router = express.Router();

// --- Hardcoded list of amenities (Replace with DB query if needed) ---
const AVAILABLE_AMENITIES = [
    { id: 'clubhouse', name: 'Clubhouse' },
    { id: 'pool', name: 'Swimming Pool Area' },
    { id: 'gym', name: 'Gymnasium' },
    { id: 'tennis', name: 'Tennis Court' },
    // Add more amenities here
];

// --- GET /api/bookings/amenities ---
// Fetches the list of available amenities
router.get('/amenities', protect, (req, res) => {
    // For now, just send the hardcoded list
    res.json(AVAILABLE_AMENITIES);
    // Later, you could fetch this from a dedicated Amenity collection if needed
});

// --- GET /api/bookings ---
// Fetches bookings, potentially filtered by date and amenity
// Example query: /api/bookings?amenityName=Clubhouse&startDate=2025-10-24&endDate=2025-10-25
router.get('/', protect, async (req, res) => {
    try {
        const { amenityName, startDate, endDate } = req.query;
        const query = {};

        if (amenityName) {
            query.amenityName = amenityName;
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            query.startTime = {};
             if (startDate) {
                // Ensure startTime is greater than or equal to the start of the startDate
                query.startTime.$gte = new Date(startDate);
             }
             if (endDate) {
                 // Ensure startTime is less than the start of the day *after* the endDate
                 const endOfDay = new Date(endDate);
                 endOfDay.setDate(endOfDay.getDate() + 1);
                 query.startTime.$lt = endOfDay;
            }
        }

        // Find bookings matching the query, populate user info (excluding password)
        const bookings = await Booking.find(query)
                                     .populate('bookedBy', 'name userId') // Select fields to populate
                                     .sort({ startTime: 1 }); // Sort by start time

        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err.message);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

// --- GET /api/bookings/my ---
// Fetches bookings made by the currently logged-in user
router.get('/my', protect, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from protect middleware
        const bookings = await Booking.find({ bookedBy: userId })
                                     .sort({ startTime: -1 }); // Show most recent first
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching user bookings:', err.message);
        res.status(500).json({ message: 'Server error fetching your bookings' });
    }
});


// --- POST /api/bookings ---
// Creates a new booking request
router.post('/', protect, async (req, res) => {
    const { amenityName, eventDescription, startTime, endTime } = req.body;
    const userId = req.user.id; // Get user ID from protect middleware

    // Basic validation
    if (!amenityName || !startTime || !endTime) {
        return res.status(400).json({ message: 'Amenity name, start time, and end time are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate times
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
         return res.status(400).json({ message: 'Invalid date/time format' });
    }
    if (start >= end) {
        return res.status(400).json({ message: 'End time must be after start time' });
    }
    if (start < new Date()) {
         return res.status(400).json({ message: 'Booking start time cannot be in the past' });
    }

    try {
        // --- Conflict Check ---
        const existingBooking = await Booking.findOne({
            amenityName: amenityName,
            status: { $in: ['Pending', 'Approved'] }, // Check against pending or approved bookings
            $or: [
                // New booking starts during an existing one
                { startTime: { $lt: end }, endTime: { $gt: start } },
                // New booking completely contains an existing one (edge case, covered by above)
                // { startTime: { $gte: start }, endTime: { $lte: end } }
            ]
        });

        if (existingBooking) {
            return res.status(409).json({ // 409 Conflict
                 message: `Time slot conflict detected. The amenity is already booked from ${existingBooking.startTime.toLocaleString()} to ${existingBooking.endTime.toLocaleString()}.`,
                 conflict: {
                     start: existingBooking.startTime,
                     end: existingBooking.endTime,
                     event: existingBooking.eventDescription
                 }
            });
        }
        // --- End Conflict Check ---

        // Create new booking
        const newBooking = new Booking({
            amenityName,
            bookedBy: userId,
            eventDescription,
            startTime: start,
            endTime: end,
            status: 'Pending' // Default status, admin might approve later
        });

        await newBooking.save();

        // Populate user info before sending response
        const populatedBooking = await Booking.findById(newBooking._id)
                                             .populate('bookedBy', 'name userId');

        res.status(201).json(populatedBooking);

    } catch (err) {
        console.error('Error creating booking:', err);
        // Handle potential validation errors from the model
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error creating booking' });
    }
});


// --- Optional: Routes for Admin (Approve/Reject/Cancel) ---
// Example: PUT /api/bookings/:id/status
// You would add another middleware here to check if req.user is an admin
/*
router.put('/:id/status', protect, isAdminMiddleware, async (req, res) => {
    const { status, adminNotes } = req.body;
    const bookingId = req.params.id;

    if (!['Approved', 'Rejected', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        booking.status = status;
        if (adminNotes) booking.adminNotes = adminNotes; // Add notes if provided

        await booking.save();
        // Optionally: Send notification to the user who booked

        res.json(booking);
    } catch (err) {
        console.error(`Error updating booking ${bookingId} status:`, err);
        res.status(500).json({ message: 'Server error updating booking status.' });
    }
});
*/

export default router;
