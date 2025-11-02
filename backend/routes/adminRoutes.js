import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';   // <-- Already imported
import Dues from '../models/Dues.js';   // <-- Already imported
import adminAuth from '../middleware/adminAuth.js'; // <-- Already imported

const router = express.Router();

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    
    // --- USING DYNAMIC CREDENTIALS ---
    const { adminId, password } = req.body; 

    // Basic validation
    if (!adminId || !password) {
        return res.status(400).json({ msg: 'Please provide Admin ID and password' });
    }

    try {
        // Check for admin user
        const admin = await Admin.findOne({ adminId: adminId });
        if (!admin) {
            console.log(`Admin login attempt failed: Admin ID ${adminId} not found.`);
            return res.status(400).json({ msg: 'Invalid credentials (admin not found)' });
        }

        // Check password
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            console.log(`Admin login attempt failed: Incorrect password for Admin ID ${adminId}.`);
            return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
        }

        const payload = {
            admin: { 
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    admin: { 
                        id: admin.id,
                        adminId: admin.adminId 
                    }
                });
            }
        );

    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during admin login.' });
    }
});


// @route   POST api/admin/dues
// @desc    Create a new due for a user
// @access  Private (Admin Only)
router.post('/dues', adminAuth, async (req, res) => {
  const { userId, amount, dueDate, type, notes } = req.body;

  if (!userId || !amount || !dueDate) {
    return res.status(400).json({ msg: 'Please provide userId, amount, and dueDate' });
  }

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ msg: `User not found with userId: ${userId}` });
    }

    const newDue = new Dues({
      user: user._id, 
      amount,
      dueDate,
      type: type || 'Maintenance', 
      notes: notes || ''
    });

    await newDue.save();
    res.status(201).json({ msg: 'Due created successfully', due: newDue });

  } catch (err) {
    console.error('Error creating due:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});


// -----------------------------------------------------------------
// --- ADD THIS NEW ROUTE ---
// @route   GET api/admin/residents
// @desc    Get all residents (users)
// @access  Private (Admin Only)
router.get('/residents', adminAuth, async (req, res) => {
  try {
    // Find all users and exclude their password
    const residents = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
// --- END OF NEW ROUTE ---
// -----------------------------------------------------------------


export default router;