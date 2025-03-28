const express = require('express');
const router = express.Router();
const activitySummaryController = require('../controllers/activitySummaryController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/activity/summary/:babyId
router.get('/summary/:babyId', authMiddleware, activitySummaryController.getActivitySummary);

// GET /api/activity/dashboard/:babyId
router.get('/dashboard/:babyId', authMiddleware, activitySummaryController.getActivitySummary);

module.exports = router;