const express = require('express');
const router = express.Router();
const controller = require('../controllers/sleepController.js');

// Register routes
router.use('/', controller);

export default router; // ✅ Correctly exporting the router
