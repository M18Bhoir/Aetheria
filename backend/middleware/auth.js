import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.user?.id;
      if (!userId) return res.status(401).json({ msg: 'Token payload invalid' });

      req.user = await User.findById(userId).select('-password');
      if (!req.user) return res.status(401).json({ msg: 'User not found' });

      next();
    } catch (err) {
      console.error('Token error:', err.message);
      if (err.name === 'TokenExpiredError') return res.status(401).json({ msg: 'Token expired' });
      return res.status(401).json({ msg: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
};

export default protect;
