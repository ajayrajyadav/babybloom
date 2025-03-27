require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser'); // Add this line
const cors = require('cors');
const mongoose = require('mongoose');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/activity/sleep', sleepRoutes);

const feedingRoutes = require('./routes/feedingRoutes');
app.use('/api/activity/feeding', feedingRoutes);
const diaperRoutes = require('./routes/diaperRoutes');
app.use('/api/activity/diaper', diaperRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Activity Logs microservice is running.');
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Activity Logs service running on port ${PORT}`);
});
