import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  // --- UPDATED: Destructure 'email' from req.body ---
  const { name, email, userId, password } = req.body;
  try {
    let userExists = await User.findOne({ $or: [{ userId }, { email }] });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists with that ID or Email' });
    }
    
    // --- UPDATED: Add 'email' to the create call ---
    const user = await User.create({ name, email, userId, password });
    
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- UPDATED: Return 'email' in the user object ---
    res.status(201).json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            userId: user.userId, 
            email: user.email 
        } 
    });
  } catch (err) {
    console.error(err);
    // Send validation errors to the client
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // --- UPDATED: Return 'email' in the user object ---
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            userId: user.userId,
            email: user.email
        } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;