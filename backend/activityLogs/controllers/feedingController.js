const mongoose = require("mongoose");
const FeedingLog = require("../models/FeedingLog");
// const ActivityLog = require("../models/ActivityLog");

// Create a new feeding log
exports.createFeedingLog = async (req, res) => {
  try {
    console.log("📥 Incoming Feeding Log Body:", req.body);
    const { babyId, startTime, endTime, amount, method, notes } = req.body;

    const newLog = new FeedingLog({
      babyId,
      startTime,
      endTime,
      amount,
      method,
      notes,
      status: endTime ? "completed" : "open",
    });

    const savedLog = await newLog.save();
    res.status(201).json({ success: true, data: savedLog, warning: null });
  } catch (error) {
    console.error("💥 Error creating feeding log:", error);
    res.status(500).json({ success: false, message: "Server error while creating feeding log." });
  }
};

// Get all feeding logs for a baby
exports.getFeedingLogs = async (req, res) => {
  try {
    const { babyId } = req.query;
    const logs = await FeedingLog.find({ babyId }).sort({ startTime: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("💥 Error fetching feeding logs:", error);
    res.status(500).json({ success: false, message: "Server error while fetching feeding logs." });
  }
};

// Get the incomplete feeding log (if any)
exports.getIncompleteFeedingLog = async (req, res) => {
  try {
    const { babyId } = req.params;
    const log = await FeedingLog.findOne({ babyId, status: "open" });
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "No incomplete feeding log found for this baby." });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    console.error("💥 Error fetching incomplete feeding log:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching incomplete log." });
  }
};

// Update an existing feeding log with endTime
exports.updateFeedingLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime } = req.body;

    const log = await FeedingLog.findById(id);
    if (!log) {
      return res.status(404).json({ success: false, message: "Feeding log not found." });
    }

    log.endTime = endTime;
    log.status = "completed";

    const updatedLog = await log.save();
    res.json({ success: true, data: updatedLog });
  } catch (error) {
    console.error("💥 Error updating feeding log:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating feeding log." });
  }
};

// Get total feeding time (in seconds) for a baby
exports.getTotalFeedingTime = async (req, res) => {
  try {
    const { babyId } = req.params;
    const result = await FeedingLog.aggregate([
      {
        $match: {
          babyId: new mongoose.Types.ObjectId(babyId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: "$duration" },
        },
      },
    ]);

    const totalSeconds = result[0]?.totalDuration || 0;
    res.json({ success: true, totalSeconds });
  } catch (error) {
    console.error("💥 Error calculating total feeding time:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating total feeding time.",
    });
  }
};

exports.getLastFeedingLog = async (req, res) => {
  try {
    const { babyId } = req.params;
    const lastLog = await FeedingLog.findOne({
      babyId,
      type: 'feeding',
      // status: 'completed'
    }).sort({ endTime: -1 });

    if (!lastLog) {
      return res.status(404).json({ success: false, message: 'No feeding logs found.' });
    }

    res.status(200).json({ success: true, data: lastLog });
  } catch (error) {
    console.error('Error fetching last feeding log:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
 
exports.getCompletedFeedingLogs = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { period = 'daily' } = req.query;

    const now = new Date();
    let start = new Date(now);

    if (period === 'weekly') start.setDate(now.getDate() - 7);
    else if (period === 'monthly') start.setMonth(now.getMonth() - 1);
    else start.setHours(0, 0, 0, 0);

    const logs = await FeedingLog.find({
      babyId,
      type: 'feeding',
      time: { $gte: start, $lte: now }
    }).sort({ time: -1 });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching completed feeding logs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFeedingMethods = (req, res) => {
  try {
    // Pull from enum in the FeedingLog schema
    const methods = require("../models/FeedingLog").schema.path("method").enumValues;
    res.status(200).json({ success: true, data: methods });
  } catch (error) {
    console.error("Error fetching feeding methods:", error);
    res.status(500).json({ success: false, message: "Server error retrieving feeding methods." });
  }
};