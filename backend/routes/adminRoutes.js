import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // <-- ADDED MISSING IMPORT
import Admin from '../models/Admin.js'; // Assuming you have this model

const router = express.Router();

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { adminId, password } = req.body;

    // Basic validation
    if (!adminId || !password) {
        return res.status(400).json({ msg: 'Please provide Admin ID and password' });
    }

    try {
        // Check for admin user
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            console.log(`Admin login attempt failed: Admin ID ${adminId} not found.`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password - MAKE SURE ADMIN PASSWORDS ARE HASHED in the DB
        // If they are not hashed, you MUST hash them first or change this comparison
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log(`Admin login attempt failed: Incorrect password for Admin ID ${adminId}.`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // --- Create JWT Payload ---
        // Use a consistent structure, maybe indicating the role
        const payload = {
            admin: { // Use 'admin' key instead of 'user'
                id: admin.id // Use MongoDB _id
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Example: Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // Send token and minimal admin info
                res.json({
                    token,
                    admin: { // Send some admin info back
                        id: admin.id,
                        adminId: admin.adminId
                        // Add other non-sensitive admin fields if needed
                    }
                });
            }
        );

    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during admin login' });
    }
});

// Add other admin-specific routes here (e.g., managing users, approving bookings)
// Remember to protect them appropriately, maybe with a dedicated admin middleware

export default router;
