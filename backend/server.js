import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // ✅ Correct

// --- Import ALL necessary routes ---
import authRoutes from './routes/authRoutes.js';   // ✅ Correct
import adminRoutes from './routes/adminRoutes.js'; // ✅ Correct
import pollRoutes from './routes/pollRoutes.js';   // ✅ Correct
import userRoutes from './routes/userRoutes.js';   // ✅ Correct
import bookingRoutes from './routes/bookingRoutes.js'; // ✅ Correct
import marketplaceRoutes from './routes/marketplaceRoutes.js'; // ✅ Correct
// --- 1. IMPORT NEW GUEST PASS ROUTE ---
import guestPassRoutes from './routes/guestPassRoutes.js';

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

// --- API Routes ---
// Mount ALL imported routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/polls', pollRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/bookings', bookingRoutes); 
app.use('/api/marketplace', marketplaceRoutes); 
// --- 2. MOUNT NEW GUEST PASS ROUTE ---
app.use('/api/guestpass', guestPassRoutes);


// Test Route (optional)
app.get('/api/test', (req, res) => res.json({ msg: 'Backend working!' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all for SPA routing (should be AFTER API routes and static serving)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  } else {
    // Let unhandled API routes or other methods fall through
    next();
  }
});

// Error handler (keep this last)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Optionally include stack in development
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));