const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate user using HTTP-only cookie JWT token
 */
const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No token found. Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      userId: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;