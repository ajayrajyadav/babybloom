require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware
//app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/activity/sleep', sleepRoutes);

const feedingRoutes = require('./routes/feedingRoutes');
app.use('/api/activity/feeding', feedingRoutes);

const diaperRoutes = require('./routes/diaperRoutes');
app.use('/api/activity/diaper', diaperRoutes);

const activitySummaryRoutes = require('./routes/activitySummaryRoutes');
app.use('/api/activity', activitySummaryRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Activity Logs microservice is running.');
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5004;
  app.listen(PORT, () => {
    console.log(`Activity Logs service running on port ${PORT}`);
  });
}

module.exports = app;