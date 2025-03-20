const express = require('express');
const { getProfile, getAdminData } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

router.get('/admin', authMiddleware, (req, res, next) => {
    console.log("🔍 Checking role middleware for /users/admin");
    roleMiddleware(req, res, next, 'admin');
}, (req, res) => {
    console.log("✅ Passed role check, calling getAdminData");
    getAdminData(req, res);
});

module.exports = router;