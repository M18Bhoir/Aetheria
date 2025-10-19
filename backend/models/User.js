import mongoose from 'mongoose';

// Define the User schema for MongoDB using Mongoose
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'], // Makes this a required field with a custom error message
        trim: true // Removes whitespace from the beginning and end of the string
    },
    userId: {
        type: String,
        required: [true, 'Please provide a User ID.'],
        unique: true, // Ensures all user IDs are unique in the collection
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.']
    },
    date: {
        type: Date,
        default: Date.now // Sets a default value to the current date and time upon creation
    }
});

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

export default User;

