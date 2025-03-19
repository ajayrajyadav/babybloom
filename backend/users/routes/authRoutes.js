const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController'); // ✅ Ensure `logout` is imported
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// ✅ Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/logout', logout); // ✅ Now correctly defined

// ✅ Protected route: Only admins can create admin users
router.post('/register/admin', authMiddleware, (req, res, next) => roleMiddleware(req, res, next, 'admin'), register);

module.exports = router;