import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 * It reads the connection string (MONGO_URI) from the environment variables
 * *at the time of connection*, ensuring .env has already been loaded by server.js.
 */
const connectDB = async () => {
  // 1. Read the variable INSIDE the function.
  // This is the key fix.
  const MONGO_URI = process.env.MONGO_URI;

  // 2. Check if it exists
  if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1);
  }

  try {
    // 3. Connect. (Note: useNewUrlParser and useUnifiedTopology are
    //    no longer needed in modern Mongoose versions)
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connection Established Successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;