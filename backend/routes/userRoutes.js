import express from 'express';
import protect from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get logged in user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
