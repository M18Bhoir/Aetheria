import mongoose from 'mongoose';

const GuestPassSchema = new mongoose.Schema({
  // The user (resident) who requested this pass
  requestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    trim: true,
    default: 'Personal Visit'
  },
  // Code is now optional, will be null until approved
  code: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values but unique once set
  },
  // Updated status enum
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  // The admin who approved or rejected this pass
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

// Index for users to find their passes
GuestPassSchema.index({ requestedBy: 1, status: 1 });

// --- FIX: REMOVED DUPLICATE INDEX ---
// GuestPassSchema.index({ code: 1 }); // This line was a duplicate of 'unique: true'

const GuestPass = mongoose.model('GuestPass', GuestPassSchema);
export default GuestPass;