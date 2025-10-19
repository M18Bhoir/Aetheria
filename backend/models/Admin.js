// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // ... other fields
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin; // ✅ CORRECT: This is a default export