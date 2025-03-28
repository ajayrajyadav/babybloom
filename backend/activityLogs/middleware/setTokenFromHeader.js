// backend/activityLogs/middleware/setTokenFromHeader.js

// This middleware checks for a token in the Authorization header,
// and if found, sets it in req.cookies.token so that the common auth middleware can read it.
module.exports = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        req.cookies = req.cookies || {};
        req.cookies.token = req.headers.authorization.split(' ')[1];
        console.log('setTokenFromHeader: extracted token:', req.cookies.token);
      }
    }
    next();
  };