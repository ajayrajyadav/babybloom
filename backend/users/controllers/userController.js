const User = require('../models/userModel');

exports.getProfile = (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password if it's present
        const { password, ...userWithoutPassword } = req.user;

        res.json(userWithoutPassword);
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAdminData = async (req, res) => {
    try {
        console.log("✅ Admin data request received");
        res.status(200).json({ message: "Admin data retrieved successfully" });
    } catch (error) {
        console.error("❌ Error fetching admin data:", error);
        res.status(500).json({ message: "Server error" });
    }
};