const mongoose = require('mongoose');
const config = require('./config');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for Activity Logs service');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
