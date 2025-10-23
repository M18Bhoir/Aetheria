// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure path is correct relative to this file

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123"); // Use fallback directly if needed

      // --- FIX: Correctly handle the nested payload ---
      const userId = decoded.user?.id; // Get ID from { user: { id: ... } }
      if (!userId) {
        console.error("JWT payload missing user.id:", decoded);
        return res.status(401).json({ msg: "Token payload is invalid" });
      }
      // Find user and attach to request, excluding password
      req.user = await User.findById(userId).select("-password");
      if (!req.user) {
         return res.status(401).json({ msg: "User not found for token" });
      }
      // --- End Fix ---

      return next(); // Proceed to the next middleware/route handler
    } catch (err) {
      console.error('Token verification failed:', err.message);
      // Differentiate between expired and invalid tokens if needed
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: "Token expired" });
      }
      return res.status(401).json({ msg: "Token is not valid" });
    }
  }

  // If no token or not Bearer token
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
  }
};

export default protect; // Keep using default export if that's your project style