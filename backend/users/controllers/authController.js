const User = require("../models/userModel");
const RefreshTokenModel = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        let userRole = "parent"; // Default role

        // ✅ First, ensure the request is authenticated
        if (role === "admin") {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized: No authentication token" });
            }
            // ✅ Then, check if the user has the correct role
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Only admins can create admin users" });
            }
            userRole = "admin";
        }

        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: userRole,
        });

        await user.save();
        res.status(201).json({ message: `User registered successfully as ${userRole}` });
    } catch (error) {
        console.error("❌ Error in user registration:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const tokenPayload = { id: user.id, role: user.role };

        // ✅ Generate Access Token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Generate Refresh Token
        const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // ✅ Store Refresh Token in DB
        await RefreshTokenModel.create({ userId: user.id, token: refreshToken });

        res.json({ token, refreshToken });
    } catch (error) {
        console.error("❌ Error in user login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        const existingToken = await RefreshTokenModel.findOne({ token: refreshToken });
        if (!existingToken) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            // ✅ Generate new access token
            const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.json({ token: newToken });
        });
    } catch (error) {
        console.error("❌ Error refreshing token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Logout and Delete Refresh Token
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await RefreshTokenModel.deleteOne({ token: refreshToken });
        }

        res.clearCookie("token");
        res.clearCookie("refreshToken");

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Error logging out:", error);
        res.status(500).json({ message: "Server error" });
    }
};