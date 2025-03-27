const jwt = require('jsonwebtoken');
const User = require('../users/models/userModel'); // used only in `requireFullUser` mode

/**
 * Shared middleware for authenticating JWT tokens from cookies.
 * Set `requireFullUser = true` if DB lookup is needed.
 */
const createAuthMiddleware = ({ requireFullUser = false } = {}) => {
  console.log('🧠 Using common/authMiddleware.js with requireFullUser =', requireFullUser);
  return async (req, res, next) => {
    try {
      let token = req.cookies?.token;
      if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }
      
      if (!token) {
        console.log('🚫 No token found in cookies:', req.cookies);
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token Decoded:', decoded);

      if (!decoded.role) {
        console.log('🚫 User role missing in token');
        return res.status(403).json({ message: 'Invalid token: No role assigned' });
      }

      if (requireFullUser) {
        const user = await User.findById(decoded.id).select('id role');

        if (!user) {
          console.log('🚫 User not found in database');
          return res.status(403).json({ message: 'User not found' });
        }

        req.user = user.toObject();
      } else {
        req.user = {
          userId: decoded.id,
          role: decoded.role
        };
      }

      console.log('✅ User Authenticated:', req.user);
      next();
    } catch (error) {
      console.log('🚫 Invalid token error:', error.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};

module.exports = createAuthMiddleware;