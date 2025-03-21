const mongoose = require('mongoose');

const BabySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Baby', BabySchema);