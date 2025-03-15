import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("🚨 No token found in Authorization header");
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        console.log("🔑 Received Token:", token);

        if (!process.env.JWT_SECRET) {
            console.error("🚨 Missing JWT_SECRET environment variable");
            return res.status(500).json({ message: "Server error: JWT secret missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token successfully verified:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};