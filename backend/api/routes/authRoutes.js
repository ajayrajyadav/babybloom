import express from "express";
import { login, registerUser, refreshToken } from "../controllers/authController.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.get("/admin", protect, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

export default router;