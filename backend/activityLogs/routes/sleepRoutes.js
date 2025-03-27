const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const activityController = require("../controllers/sleepController");

router.use(authMiddleware);

router.post("/", activityController.createSleepLog);
router.get("/", activityController.getSleepLogs);
router.get("/incomplete/:babyId", activityController.getIncompleteSleepLog);
router.patch("/:id", activityController.updateSleepLog);
router.get("/total/:babyId", activityController.getTotalSleepTime);

module.exports = router;
