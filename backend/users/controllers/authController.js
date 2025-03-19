const User = require("../models/userModel");
const RefreshTokenModel = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to create tokens and set cookies
const setAuthCookies = (res, user) => {
    const tokenPayload = { id: user.id, role: user.role };

    // Generate Access Token (Expires in 1 hour)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Generate Refresh Token (Expires in 7 days)
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    // Store Refresh Token in DB
    RefreshTokenModel.create({ userId: user.id, token: refreshToken });

    // Set Cookies (HttpOnly for security)
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    return { token, refreshToken };
};

// ✅ User Registration
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        let userRole = "parent"; // Default role

        if (role === "admin") {
            if (!req.user || req.user.role !== "admin") {
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

// ✅ User Login (Stores token in cookies)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Set auth cookies
        setAuthCookies(res, user);

        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("❌ Error in user login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Refresh Token (Uses Cookie Instead of Body)
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

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

            // Generate new access token
            const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", newToken, { httpOnly: true, secure: true, sameSite: "Strict" });
            res.json({ message: "Token refreshed successfully" });
        });
    } catch (error) {
        console.error("❌ Error refreshing token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Logout (Clears Cookies)
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

// ✅ Get Profile (Requires Authentication)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get Admin Data (Requires Admin Role)
exports.getAdminData = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can access this route" });
        }

        res.json({ message: "Welcome, admin!" }); // ✅ Ensure this response exists
    } catch (error) {
        console.error("❌ Error fetching admin data:", error);
        res.status(500).json({ message: "Server error" });
    }
};