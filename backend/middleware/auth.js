import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Correct path

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- Expect consistent payload: { user: { id: userId } } ---
      const userIdFromToken = decoded.user?.id;
      if (!userIdFromToken) {
        console.error("JWT payload missing user.id:", decoded);
        return res.status(401).json({ msg: "Not authorized, token payload invalid" });
      }

      // Fetch user from DB using the ID from the token
      req.user = await User.findById(userIdFromToken).select("-password"); // Use findById with the token ID

      if (!req.user) {
         return res.status(401).json({ msg: "Not authorized, user not found" });
      }

      // User is authenticated, proceed
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

export default protect;
