const adminMiddleware = (req, res, next) => {
    console.log("🔍 Checking Admin Middleware...");
    console.log("🔍 User Object:", req.user);

    if (!req.user) {
        console.log("🚫 No user found in request");
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (req.originalUrl === "/users/register/admin" && req.user.role !== "admin") {
        console.log("🚫 User is not authorized to create admin users");
        return res.status(403).json({ message: "Only admins can create admin users" });
    }

    if (req.user.role !== "admin") {
        console.log("🚫 User is not an admin");
        return res.status(403).json({ message: "Only admins can access this route" });
    }

    console.log("✅ User is an admin, proceeding...");
    next();
};

module.exports = adminMiddleware;