import express from "express";
import { login, registerUser, refreshToken, logout } from "../controllers/authController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post('/logout', logout);
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

export default router;