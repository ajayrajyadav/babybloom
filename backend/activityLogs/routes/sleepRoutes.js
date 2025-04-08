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
router.get("/last/:babyId", activityController.getLastSleepLog);
router.get("/completed/:babyId", activityController.getCompletedSleepLogs);


module.exports = router;
