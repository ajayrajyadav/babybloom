const express = require('express');
const router = express.Router();

// Import individual activity routes
const sleepRoutes = require('./sleepRoutes');
const feedingRoutes = require('./feedingRoutes');
const diaperRoutes = require('./diaperRoutes');

// Use them with route prefixes
router.use('/sleep', sleepRoutes);
router.use('/feeding', feedingRoutes);
router.use('/diaper', diaperRoutes);

module.exports = router;