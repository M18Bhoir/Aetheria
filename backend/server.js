import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the centralized database connection
import connectDB from './config/db.js';

// Import all models from their separate files
import User from '../../backend/models/User.js';
import Admin from '../../backend/models/Admin.js';
import Poll from '../../backend/models/Poll.js';

// --- Environment Variable Configuration ---
// This robustly finds the .env file whether you run from the root or /backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();
app.use(cors());
app.use(express.json());

// ❌ We removed connectDB() from here to prevent a race condition.

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Check if JWT_SECRET is loaded
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in your .env file.');
    process.exit(1);
}

// --- Model Associations ---
// In Mongoose, associations are handled via 'ref' in the schema,
// so no explicit association code is needed here like in Sequelize.


// --- Middleware for JWT Authentication ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


// --- API Routes ---

// Centralized User Registration
app.post("/api/auth/signup", async (req, res) => {
    const { name, userId, password } = req.body;
    if (!name || !userId || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields." });
    }
    try {
        let user = await User.findOne({ userId });
        if (user) {
            return res.status(400).json({ success: false, message: "User ID already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({ name, userId, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

        res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, userId: user.userId } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Alias for voting system frontend
app.post("/auth/register", (req, res) => {
    // 307 Temporary Redirect preserves the POST method and its request body
    res.redirect(307, '/api/auth/signup');
});


// Centralized User Login
app.post("/api/auth/login", async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });
        res.json({ token, user: { id: user.id, name: user.name, userId: user.userId } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Aliases for different frontend paths
app.post("/api/user/login", (req, res) => res.redirect(307, '/api/auth/login'));
app.post("/auth/login", (req, res) => res.redirect(307, '/api/auth/login'));


// Aetheria: Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { adminId, password } = req.body;
  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// --- Poll Routes ---

app.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ date: -1 }).populate('createdBy', 'name');
        res.json(polls);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/polls/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.json(poll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/polls', authMiddleware, async (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ msg: 'Please provide a question and at least two options.' });
    }
    try {
        const pollOptions = options.map(opt => ({ text: opt, votes: 0 }));
        const newPoll = new Poll({
            question,
            options: pollOptions,
            createdBy: req.user.id,
        });
        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/polls/:id/vote', async (req, res) => {
    const { optionIndex } = req.body;
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        if (optionIndex === null || optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ msg: 'Invalid option selected' });
        }

        poll.options[optionIndex].votes += 1;
        await poll.save();
        
        res.json(poll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- Server Initialization ---
const startServer = async () => {
    try {
        // ✅ --- THIS IS THE FIX ---
        // First, wait for the database connection to be established.
        await connectDB(); 

        // Now that we're connected, it's safe to query the database.
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await new Admin({ adminId: 'admin', password: hashedPassword }).save();
            console.log("Default admin created with ID 'admin' and password 'admin123'");
        }

        // Once all DB operations are done, start listening for web requests.
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.error("Server startup error:", error);
    }
};

// Start the server
startServer();