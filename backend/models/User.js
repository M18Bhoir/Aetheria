// backend/models/User.js
import mongoose from 'mongoose';

// Define the User schema for MongoDB using Mongoose
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        trim: true
    },
    userId: {
        type: String,
        required: [true, 'Please provide a User ID.'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.']
    },
    // --- ADDED: Field for current dues ---
    currentDues: {
        amount: {
            type: Number,
            default: 0 // Start with 0 dues by default
        },
        dueDate: {
            type: Date
        },
        status: { // Optional: Track if paid or pending
            type: String,
            enum: ['Pending', 'Paid', 'Overdue'],
            default: 'Pending'
        },
        lastUpdated: { // Optional: Track when dues were last updated
            type: Date,
            default: Date.now
        }
    }
    // --- End Added Field ---
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

export default User;