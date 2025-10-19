import express from "express";
import jwt from "jsonwebtoken";
import User from "../../../backend/models/User.js";

const router = express.Router();

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, userId, password } = req.body;
    const existing = await User.findOne({ userId });
    if (existing) return res.status(400).json({ msg: "User ID already exists" });

    const user = await User.create({ name, userId, password });
    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
