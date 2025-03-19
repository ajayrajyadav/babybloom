const roleMiddleware = (req, res, next, requiredRole) => {
    if (!req.user || req.user.role !== requiredRole) {
        console.log("🚫 User is not authorized to access this route");
        return res.status(403).json({ message: `Forbidden: Only ${requiredRole}s can access this route` });
    }
    
    console.log(`✅ User authorized as ${req.user.role}, proceeding...`);
    next();
};

module.exports = roleMiddleware;