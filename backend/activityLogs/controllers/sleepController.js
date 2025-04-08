const ActivityLog = require('../models/ActivityLog');

// Create a new sleep log
exports.createSleepLog = async (req, res) => {
  try {
    const { babyId, startTime, notes } = req.body;
    if (!babyId || !startTime) {
      return res.status(400).json({ success: false, message: 'babyId and startTime are required.' });
    }

    const existingLog = await ActivityLog.findOne({ babyId, type: 'sleep', endTime: { $exists: false } });
    if (existingLog) {
      return res.status(200).json({
        success: true,
        warning: 'There is an existing incomplete sleep log for this baby.',
        incompleteLog: existingLog
      });
    }

    const newLog = new ActivityLog({
      babyId,
      type: 'sleep',
      startTime,
      notes,
      status: 'open'
    });

    await newLog.save();
    return res.status(201).json({
      success: true,
      data: newLog,
      message: 'Sleep log created successfully.'
    });
  } catch (error) {
    console.error('Error creating sleep log:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating sleep log.' });
  }
};

// Retrieve sleep logs (optionally filtered by babyId)
exports.getSleepLogs = async (req, res) => {
  try {
    const { babyId } = req.query;
    const query = { type: 'sleep' };
    if (babyId) {
      query.babyId = babyId;
    }

    const logs = await ActivityLog.find(query).sort({ startTime: -1 });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching sleep logs:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching sleep logs.' });
  }
};

// Get an incomplete sleep log for a given baby
exports.getIncompleteSleepLog = async (req, res) => {
  try {
    const { babyId } = req.params;
    if (!babyId) {
      return res.status(400).json({ success: false, message: 'babyId is required.' });
    }
    const incompleteLog = await ActivityLog.findOne({ babyId, type: 'sleep', endTime: { $exists: false } });
    if (!incompleteLog) {
      return res.status(404).json({ success: false, message: 'No incomplete sleep log found for this baby.' });
    }
    return res.status(200).json({ success: true, data: incompleteLog });
  } catch (error) {
    console.error('Error fetching incomplete sleep log:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching incomplete sleep log.' });
  }
};

// Update a sleep log (to add an endTime)
exports.updateSleepLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime, notes } = req.body;

    if (!endTime) {
      return res.status(400).json({ success: false, message: 'endTime is required for update.' });
    }

    const log = await ActivityLog.findOne({ _id: id, type: 'sleep' });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Sleep log not found.' });
    }

    if (new Date(endTime) <= new Date(log.startTime)) {
      return res.status(400).json({ success: false, message: 'endTime must be after startTime.' });
    }

    log.endTime = endTime;
    if (notes) log.notes = notes;
    log.status = 'completed';

    const start = new Date(log.startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const duration = Math.floor(durationMs / 1000);
    log.duration = duration;

    await log.save();

    return res.status(200).json({
      success: true,
      data: log,
      message: 'Sleep log updated successfully.'
    });
  } catch (error) {
    console.error('Error updating sleep log:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating sleep log.' });
  }
};

// Get total sleep duration
exports.getTotalSleepTime = async (req, res) => {
  const { babyId } = req.params;
  try {
    const logs = await ActivityLog.find({
      babyId,
      type: 'sleep',
      status: 'completed',
      duration: { $exists: true },
    });
    const totalSeconds = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
    res.json({ success: true, totalSeconds });
  } catch (error) {
    console.error('💥 Error calculating total sleep time:', error);
    res.status(500).json({ success: false, message: 'Server error while calculating sleep duration.' });
  }
};

// ✅ Get last sleep log for a baby
exports.getLastSleepLog = async (req, res) => {
  try {
    const { babyId } = req.params;
    const lastLog = await ActivityLog.findOne({
      babyId,
      type: 'sleep',
      status: 'completed'
    }).sort({ endTime: -1 });

    if (!lastLog) {
      return res.status(404).json({ success: false, message: 'No completed sleep logs found.' });
    }

    res.status(200).json({ success: true, data: lastLog });
  } catch (error) {
    console.error('💥 Error fetching last sleep log:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching last sleep log.' });
  }
};

// ✅ Get all completed sleep logs by period
exports.getCompletedSleepLogs = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { period = 'daily' } = req.query;

    const now = new Date();
    let start = new Date(now);

    if (period === 'weekly') start.setDate(now.getDate() - 7);
    else if (period === 'monthly') start.setMonth(now.getMonth() - 1);
    else start.setHours(0, 0, 0, 0);

    const logs = await ActivityLog.find({
      babyId,
      type: 'sleep',
      status: 'completed',
      startTime: { $gte: start, $lte: now },
    }).sort({ startTime: -1 });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('💥 Error fetching completed sleep logs:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching logs.' });
  }
};
