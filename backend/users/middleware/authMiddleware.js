const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {
        // ✅ Read token from HTTP-only cookie
        const token = req.cookies?.token;

        if (!token) {
            console.log("🚫 No token found in cookies:", req.cookies);
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // ✅ Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // ✅ Ensure the token contains a role
        if (!decoded.role) {
            console.log("🚫 User role missing in token");
            return res.status(403).json({ message: "Invalid token: No role assigned" });
        }

        // ✅ Retrieve full user details from DB (Ensures user still exists)
        const user = await User.findById(decoded.id).select("id role");

        if (!user) {
            console.log("🚫 User not found in database");
            return res.status(403).json({ message: "User not found" });
        }

        // ✅ Attach user details to request object
        req.user = user.toObject(); // Convert Mongoose object to plain JS object

        console.log("✅ User Authenticated:", req.user);
        next();
    } catch (error) {
        console.log("🚫 Invalid token error:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
};