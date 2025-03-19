const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController'); // ✅ Ensure `logout` is imported
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Protected route: Only admins can create admins
router.post('/register/admin', authMiddleware, adminMiddleware, register);

router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/logout', logout); // ✅ Now correctly defined

module.exports = router;