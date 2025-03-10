import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Sample API route working!" });
});

export default router; // ✅ Correctly exporting the router
