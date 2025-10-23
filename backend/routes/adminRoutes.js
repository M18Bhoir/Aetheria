import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { adminId, password } = req.body;
  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, admin: { id: admin._id, adminId: admin.adminId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
