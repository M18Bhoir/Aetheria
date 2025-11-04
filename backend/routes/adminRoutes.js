import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';   
import Dues from '../models/Dues.js';   
import adminAuth from '../middleware/adminAuth.js'; 
import axios from 'axios'; // <-- Make sure axios is imported

const router = express.Router();

// ... (existing /login route is unchanged) ...
router.post('/login', async (req, res) => {
    
    const { adminId, password } = req.body; 

    if (!adminId || !password) {
        return res.status(400).json({ msg: 'Please provide Admin ID and password' });
    }

    try {
        const admin = await Admin.findOne({ adminId: adminId });
        if (!admin) {
            console.log(`Admin login attempt failed: Admin ID ${adminId} not found.`);
            return res.status(400).json({ msg: 'Invalid credentials (admin not found)' });
        }

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


// ... (existing /dues route is unchanged) ...
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

// ... (existing /residents route is unchanged) ...
router.get('/residents', adminAuth, async (req, res) => {
  try {
    const residents = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ... (existing /maintenance-forecast route is unchanged) ...
router.post('/maintenance-forecast', adminAuth, async (req, res) => {
    try {
        const inputFeatures = req.body;
        const mlApiResponse = await axios.post(
            'http://127.0.0.1:5000/predict', 
            inputFeatures
        );
        res.json(mlApiResponse.data);
    } catch (err) {
        console.error('Error calling ML API:', err.message);
        if (err.response && err.response.data) {
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ msg: 'Server error while getting forecast.' });
    }
});


// --- 1. NEW ROUTE: Get all dues for all users ---
// @route   GET /api/admin/all-dues
// @desc    Admin gets a list of all dues
// @access  Private (Admin Only)
router.get('/all-dues', adminAuth, async (req, res) => {
    try {
        const dues = await Dues.find({})
            .populate('user', 'name userId') // Get user info
            .sort({ dueDate: -1 }); // Show most recent first
        res.json(dues);
    } catch (err) {
        console.error('Error fetching all dues:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// --- 2. NEW ROUTE: Update a due's status ---
// @route   PATCH /api/admin/dues/:id/status
// @desc    Admin manually updates a due's status (e.g., to 'Paid')
// @access  Private (Admin Only)
router.patch('/dues/:id/status', adminAuth, async (req, res) => {
    const { status } = req.body;

    // Validate the incoming status
    if (!status || !['Pending', 'Paid', 'Overdue'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const due = await Dues.findById(req.params.id);
        if (!due) {
            return res.status(404).json({ msg: 'Due not found' });
        }

        due.status = status;
        await due.save();

        // Send back the updated due, populated with user info
        const updatedDue = await Dues.findById(due._id).populate('user', 'name userId');
        res.json(updatedDue);

    } catch (err) {
        console.error('Error updating due status:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});
// --- NEW ROUTE: Admin Dashboard Stats ---
// @route   GET /api/admin/dashboard-stats
// @desc    Get summary statistics for admin dashboard
// @access  Private (Admin Only)
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDues = await Dues.countDocuments();
    const paidDues = await Dues.countDocuments({ status: 'Paid' });
    const pendingDues = await Dues.countDocuments({ status: 'Pending' });
    const overdueDues = await Dues.countDocuments({ status: 'Overdue' });

    res.json({
      totalUsers,
      totalDues,
      paidDues,
      pendingDues,
      overdueDues,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err.message);
    res.status(500).json({ msg: 'Server error while fetching dashboard stats' });
  }
});



export default router;