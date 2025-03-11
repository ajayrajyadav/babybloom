import express from "express";
import { register, login, logout, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);  // 🔐 Protect the logout endpoint
router.get("/profile", protect, getProfile);

export default router;