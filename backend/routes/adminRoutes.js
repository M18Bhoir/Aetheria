import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import User from '../models/User.js';   
import Dues from '../models/Dues.js';   
import adminAuth from '../middleware/adminAuth.js'; 
// --- 1. IMPORT THE NEW GUESTPASS MODEL ---
import GuestPass from '../models/GuestPass.js';

const router = express.Router();

// @route   POST api/admin/login
// ... (existing login route code) ...
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
// ... (existing dues route code) ...
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


// @route   GET api/admin/residents
// ... (existing residents route code) ...
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

// -----------------------------------------------------------------
// --- 2. ADD NEW GUEST PASS ROUTES ---
// -----------------------------------------------------------------

// @route   POST api/admin/guestpass
// @desc    Admin creates a new guest pass
// @access  Private (Admin Only)
router.post('/guestpass', adminAuth, async (req, res) => {
  const { residentUserId, guestName, visitDate, reason } = req.body;
  
  if (!residentUserId || !guestName || !visitDate) {
    return res.status(400).json({ msg: 'Resident User ID, Guest Name, and Visit Date are required.' });
  }

  try {
    // Find the resident by their User ID (e.g., "A-101")
    const resident = await User.findOne({ userId: residentUserId });
    if (!resident) {
      return res.status(404).json({ msg: `Resident with User ID '${residentUserId}' not found.` });
    }

    // Generate a simple unique code
    const code = `GP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newPass = new GuestPass({
      resident: resident._id,
      guestName,
      visitDate: new Date(visitDate),
      reason,
      code,
      status: 'Active',
      createdBy: req.admin.id // From adminAuth middleware
    });

    await newPass.save();
    
    // Populate resident info before sending back
    const pass = await GuestPass.findById(newPass._id).populate('resident', 'name userId');
    res.status(201).json(pass);

  } catch (err) {
    console.error('Error creating guest pass:', err.message);
    if (err.code === 11000) { // Handle duplicate code error
        return res.status(400).json({ msg: 'Code generation conflict. Please try again.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/admin/guestpass
// @desc    Admin gets all guest passes (e.g., active and recent)
// @access  Private (Admin Only)
router.get('/guestpass', adminAuth, async (req, res) => {
    try {
        // Find all passes, populate resident info, sort by most recent visit date
        const passes = await GuestPass.find()
            .populate('resident', 'name userId')
            .sort({ visitDate: -1 }); // Show upcoming/recent first
        res.json(passes);
    } catch (err) {
        console.error('Error fetching guest passes:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PATCH api/admin/guestpass/:id/revoke
// @desc    Admin revokes (cancels) an active guest pass
// @access  Private (Admin Only)
router.patch('/guestpass/:id/revoke', adminAuth, async (req, res) => {
    try {
        const pass = await GuestPass.findById(req.params.id);
        if (!pass) {
            return res.status(404).json({ msg: 'Guest pass not found' });
        }

        pass.status = 'Revoked';
        await pass.save();
        
        const updatedPass = await GuestPass.findById(pass._id).populate('resident', 'name userId');
        res.json(updatedPass);
    } catch (err) {
        console.error('Error revoking guest pass:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});


export default router;