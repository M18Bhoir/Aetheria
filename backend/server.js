import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // ✅ Correct

// Routes
import authRoutes from './routes/authRoutes.js';   // ✅ Correct
import adminRoutes from './routes/adminRoutes.js'; // ✅ Correct
import pollRoutes from './routes/pollRoutes.js';   // ✅ Correct
import userRoutes from './routes/userRoutes.js';   // ✅ Correct

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/user', userRoutes);

// Test Route
app.get('/api/test', (req, res) => res.json({ msg: 'Backend working!' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  } else next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Server error!');
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
