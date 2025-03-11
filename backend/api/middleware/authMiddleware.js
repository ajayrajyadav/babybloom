import jwt from "jsonwebtoken"; // ✅ Add this
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("🚨 No token found in Authorization header");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const token = authHeader.split(' ')[1];

        console.log("🔑 Received Token:", token);
        console.log("🔍 Expected JWT_SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Now jwt is defined
        console.log("✅ Token successfully verified:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};