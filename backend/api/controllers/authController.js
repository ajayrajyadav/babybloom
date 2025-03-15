import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import crypto from "crypto";

// ✅ Helper function to handle errors
const handleError = (res, statusCode, message, error = null) => {
    if (error) console.error(`${message}:`, error);
    return res.status(statusCode).json({ message });
};

// ✅ Generate Access Token
const generateAccessToken = (user) => {
    try {
        return jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
        );
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Failed to generate access token");
    }
};

// ✅ Generate Secure Refresh Token (Hashed before saving)
const generateRefreshToken = async (user) => {
    try {
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d" }
        );

        // Log the actual refresh token generated
        console.log("📝 Generated Refresh Token:", refreshToken);

        // Hash the token before storing in DB
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        console.log("🔒 Hashed Refresh Token:", hashedToken);

        // Delete any old refresh tokens for this user before saving the new one
        await RefreshToken.deleteMany({ userId: user._id });

        // Save hashed refresh token in DB
        const storedToken = await RefreshToken.create({
            userId: user._id,
            token: hashedToken, // ✅ Store hashed version instead of raw token
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        console.log("📌 Stored Token in DB:", storedToken);

        // Verify that the token was actually stored in DB
        const verifyToken = await RefreshToken.findOne({ userId: user._id });
        console.log("✅ Verified Token in DB:", verifyToken);

        return refreshToken; // Return the original (non-hashed) token to the client
    } catch (error) {
        console.error("❌ Error generating refresh token:", error);
        throw new Error("Failed to generate refresh token");
    }
};

// ✅ Register User
export const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) return handleError(res, 400, "Email and password are required");

        const existingUser = await User.findOne({ email });
        if (existingUser) return handleError(res, 400, "User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role: role || "user" });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return handleError(res, 500, "Server error during registration", error);
    }
};

// ✅ Login User & Store Refresh Token in Secure Cookie
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return handleError(res, 400, "Email and password are required");

        const user = await User.findOne({ email });
        if (!user) return handleError(res, 401, "Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return handleError(res, 401, "Invalid credentials");

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({ accessToken, message: "Login successful" });
    } catch (error) {
        return handleError(res, 500, "Server error during login", error);
    }
};

// ✅ Refresh Token Endpoint (Read from Cookie)
export const refreshToken = async (req, res) => {
    console.log("🔍 Incoming Cookies:", req.cookies);

    const refreshToken = req.cookies.refreshToken; // Read from cookies
    if (!refreshToken) {
        console.log("❌ No refresh token provided.");
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Hash the received refresh token (must match stored hashed version)
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    console.log("🔑 Hashed Token from Request:", hashedToken);

    // Find the token in DB
    const storedToken = await RefreshToken.findOne({ token: hashedToken });
    console.log("📌 Stored Token in DB:", storedToken);

    if (!storedToken) {
        console.log("❌ Refresh token not found or expired.");
        return res.status(403).json({ message: "Refresh token not found or expired" });
    }

    // Fetch user details
    const user = await User.findById(storedToken.userId);
    if (!user) {
        console.log("❌ User not found.");
        return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ Refresh token verified successfully.");
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
};
// ✅ Logout & Remove Refresh Token
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            console.log("🚨 Logout Failed: No refresh token provided");
            return res.status(401).json({ message: "Not authorized, no token" }); // ✅ Fixed to match test expectation
        }

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const deletedToken = await RefreshToken.findOneAndDelete({ token: hashedToken });

        if (!deletedToken) {
            console.log("🚨 Logout Failed: Invalid or already deleted refresh token");
            return res.status(401).json({ message: "Not authorized, token failed" }); // ✅ Fixed to match test expectation
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        console.log("✅ Logout Successful");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Logout Error:", error);
        return res.status(500).json({ message: "Server error during logout" });
    }
};