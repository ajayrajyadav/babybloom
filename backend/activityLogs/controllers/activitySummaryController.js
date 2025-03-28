// backend/activityLogs/controllers/activitySummaryController.js

const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');
const FeedingLog = require('../models/FeedingLog');
const DiaperLog = require('../models/DiaperLog');
const { formatDuration } = require('../utils/timeUtils');

function getTimeRange(period) {
  const now = new Date();
  let start;
  switch (period) {
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      break;
    case 'daily':
    default:
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}

exports.getActivitySummary = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { period = 'daily' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(babyId)) {
      return res.status(400).json({ success: false, message: 'Invalid babyId format.' });
    }

    const { start, end } = getTimeRange(period);

    const sleepLogs = await ActivityLog.find({
      babyId,
      type: 'sleep',
      startTime: { $gte: start, $lte: end },
      status: 'completed',
    });

    const totalSleepSeconds = sleepLogs.reduce((acc, log) => acc + (log.duration || 0), 0);

    const feedingLogs = await FeedingLog.find({
      babyId,
      startTime: { $gte: start, $lte: end },
      status: 'completed',
    });

    const totalFeedingSeconds = feedingLogs.reduce((acc, log) => acc + (log.duration || 0), 0);

    const diaperLogs = await DiaperLog.find({
      babyId,
      time: { $gte: start, $lte: end },
    });

    const diaperStats = diaperLogs.reduce((acc, log) => {
      acc.total += 1;
      const type = log.contents;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, { total: 0 });

    res.json({
      success: true,
      data: {
        period,
        totalSleep: {
          seconds: totalSleepSeconds,
          formatted: formatDuration(totalSleepSeconds),
        },
        totalFeeding: {
          seconds: totalFeedingSeconds,
          formatted: formatDuration(totalFeedingSeconds),
        },
        diaperStats,
      },
    });
  } catch (err) {
    console.error('💥 Error generating activity summary:', err);
    res.status(500).json({ success: false, message: 'Server error generating summary.' });
  }
};
