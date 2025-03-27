// backend/activityLogs/routes/diaperRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const diaperController = require("../controllers/diaperController");

router.use(authMiddleware);

router.post("/", diaperController.createDiaperLog);
router.get("/", diaperController.getDiaperLogs);

module.exports = router;