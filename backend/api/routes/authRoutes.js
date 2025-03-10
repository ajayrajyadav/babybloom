import express from 'express';

const router = express.Router();

console.log("✅ Inside authRoutes.js - Defining Routes");

router.post('/login', (req, res) => {
    res.json({ message: "Login endpoint hit" });
});

router.post('/register', (req, res) => {
    res.json({ message: "Register endpoint hit" });
});

console.log("✅ Defined Routes in authRoutes.js:", router.stack.map(r => r.route?.path).filter(Boolean));

export default router;