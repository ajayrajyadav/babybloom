const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("🚫 No token found");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        if (!decoded.role) {
            console.log("🚫 User role missing in token");
            return res.status(403).json({ message: "Invalid token: No role assigned" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log("🚫 Invalid token error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};