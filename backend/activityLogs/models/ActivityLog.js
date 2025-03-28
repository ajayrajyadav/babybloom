const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  type: { type: String, required: true }, // e.g., 'sleep', 'diaper', 'feeding'
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // Duration in minutes (auto-calculated)
  notes: { type: String },
  status: { type: String, enum: ['open', 'completed'], default: 'open' }
}, { timestamps: true });

// Automatically calculate duration before saving, if applicable
ActivityLogSchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.round(durationMs / (1000 * 60)); // convert to minutes
  } else {
    this.duration = undefined; // Clear if incomplete
  }
  next();
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema, 'activityLogs');