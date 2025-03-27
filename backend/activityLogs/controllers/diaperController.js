// backend/activityLogs/controllers/diaperController.js
const DiaperLog = require("../models/DiaperLog");

exports.createDiaperLog = async (req, res) => {
  try {
    const { babyId, time, contents, color, notes } = req.body;

    const log = await DiaperLog.create({
      babyId,
      time,
      contents,
      color,
      notes,
      status: "completed", // no open state unless we want it later
    });

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("Diaper log creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDiaperLogs = async (req, res) => {
  try {
    const { babyId } = req.query;
    const logs = await DiaperLog.find({ babyId }).sort({ time: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Fetching diaper logs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};