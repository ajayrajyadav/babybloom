const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const feedingController = require("../controllers/feedingController");

router.use(authMiddleware);

router.post("/", feedingController.createFeedingLog);
router.get("/incomplete/:babyId", feedingController.getIncompleteFeedingLog);
router.get("/", feedingController.getFeedingLogs);
router.patch("/:id", feedingController.updateFeedingLog);
router.get('/total/:babyId', feedingController.getTotalFeedingTime);

module.exports = router;