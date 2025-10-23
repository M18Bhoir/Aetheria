import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  amenityName: {
    type: String,
    required: [true, 'Please specify the amenity name (e.g., Clubhouse, Pool Area)'],
    trim: true,
    // Consider using an enum if you have a fixed list of amenities
    // enum: ['Clubhouse', 'Swimming Pool', 'Gym', 'Tennis Court']
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  eventDescription: {
    type: String,
    trim: true,
    default: 'General Booking'
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start date and time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end date and time'],
    // Optional: Add validation to ensure endTime is after startTime
    validate: [
      function(value) {
        // `this` refers to the document being validated
        return this.startTime < value;
      },
      'End time must be after start time'
    ]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending', // Or 'Approved' if no approval process
  },
  // Optional: Add fields for admin comments, payment status, etc.
  // adminNotes: String,
  // paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }

}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add an index for efficient querying of overlapping bookings
BookingSchema.index({ amenityName: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
