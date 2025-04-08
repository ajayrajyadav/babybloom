// backend/activityLogs/controllers/diaperController.js
const DiaperLog = require("../models/DiaperLog");
// const ActivityLog = require("../models/ActivityLog");

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

exports.getLastDiaperLog = async (req, res) => {
  try {
    const { babyId } = req.params;

    const lastLog = await DiaperLog.findOne({
      babyId,
      type: 'diaper'
    }).sort({ time: -1 });

    if (!lastLog) {
      return res.status(404).json({ success: false, message: 'No diaper logs found.' });
    }

    res.status(200).json({ success: true, data: lastLog });
  } catch (error) {
    console.error('Error fetching last diaper log:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCompletedDiaperLogs = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { period = 'daily' } = req.query;

    const now = new Date();
    let start = new Date(now);

    if (period === 'weekly') start.setDate(now.getDate() - 7);
    else if (period === 'monthly') start.setMonth(now.getMonth() - 1);
    else start.setHours(0, 0, 0, 0);

    const logs = await DiaperLog.find({
      babyId,
      type: 'diaper',
      time: { $gte: start, $lte: now }
    }).sort({ time: -1 });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching completed diaper logs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};