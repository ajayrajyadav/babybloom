const express = require('express');
const { getProfile, getAdminData } = require('../controllers/userController'); // ✅ Ensure correct imports
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Protected route: Get user profile (Requires authentication)
router.get('/profile', authMiddleware, getProfile);

// Admin-only route
router.get('/admin', authMiddleware, adminMiddleware, getAdminData);

module.exports = router;