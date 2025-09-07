import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  userId: { type: String, unique: true }, // ✅ replace email
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});


// SignUp
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, userId, password } = req.body;

    // Check if userId already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.json({ success: false, message: "User ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      userId,
      password: hashedPassword,
      role: "user", // default role
    });

    await newUser.save();

    console.log("✅ User registered:", userId);
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// User Login
app.post("/api/user/login", async (req, res) => {
  try {
    const { userId, password } = req.body; // frontend sends userId
    const user = await User.findOne({ userId, role: "user" }); // 👈 now checking userId
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});






// ✅ Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { adminId, password } = req.body;


    const admin = await User.findOne({ name: adminId, role: "admin" });

    if (!admin) return res.json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Admin logged in:", admin.name);
    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
