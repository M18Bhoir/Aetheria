import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // Import the Admin model

const adminAuth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- Look for admin payload ---
      const adminIdFromToken = decoded.admin?.id; // Check for 'admin' key
      if (!adminIdFromToken) {
        console.error("JWT payload missing admin.id:", decoded);
        return res.status(401).json({ msg: "Not authorized, token payload invalid" });
      }

      // Fetch admin from DB using the ID from the token
      req.admin = await Admin.findById(adminIdFromToken).select("-password"); 

      if (!req.admin) {
         return res.status(401).json({ msg: "Not authorized, admin not found" });
      }

      // Admin is authenticated, proceed
      return next();

    } catch (err) {
      console.error('Token verification failed:', err.message);
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ msg: "Not authorized, token expired" });
      }
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  // No token found
  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};

export default adminAuth;