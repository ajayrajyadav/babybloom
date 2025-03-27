#!/bin/bash

# This script creates the Activity Logs microservice folder structure and starter files.
# It assumes you are running it from the root of your Babybloom project.

SERVICE_DIR="backend/activityLogs"

echo "Creating Activity Logs microservice structure in ${SERVICE_DIR}..."

# Create necessary directories
mkdir -p ${SERVICE_DIR}/{config,controllers,middleware,models,routes,tests}

# Create package.json
cat > ${SERVICE_DIR}/package.json << 'EOF'
{
  "name": "activityLogs",
  "version": "1.0.0",
  "description": "Activity Logs microservice for Babybloom",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mongoose": "^6.0.0"
  },
  "devDependencies": {
    "jest": "^27.0.0",
    "nodemon": "^2.0.0",
    "supertest": "^6.0.0"
  }
}
EOF

# Create .env file
cat > ${SERVICE_DIR}/.env << 'EOF'
PORT=5004
MONGO_URI=mongodb://localhost:27017/babybloom-activityLogs
EOF

# Create the main index.js file
cat > ${SERVICE_DIR}/index.js << 'EOF'
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(express.json());

// Routes
const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/activity/sleep', sleepRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Activity Logs microservice is running.');
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Activity Logs service running on port ${PORT}`);
});
EOF

# Create configuration file for general settings
cat > ${SERVICE_DIR}/config/config.js << 'EOF'
module.exports = {
  port: process.env.PORT || 5004,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/babybloom-activityLogs'
};
EOF

# Create the database connection file
cat > ${SERVICE_DIR}/config/db.js << 'EOF'
const mongoose = require('mongoose');
const config = require('./config');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for Activity Logs service');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
EOF

# Create a placeholder sleep controller
cat > ${SERVICE_DIR}/controllers/sleepController.js << 'EOF'
exports.createSleepLog = (req, res) => {
  // TODO: Implement logic to create a sleep log (with check for an incomplete log)
  res.json({ message: 'Create sleep log endpoint' });
};

exports.getSleepLogs = (req, res) => {
  // TODO: Implement logic to fetch sleep logs (optionally filtered by babyId)
  res.json({ message: 'Get sleep logs endpoint' });
};

exports.getIncompleteSleepLog = (req, res) => {
  // TODO: Implement logic to get an incomplete sleep log for a baby
  res.json({ message: 'Get incomplete sleep log endpoint' });
};

exports.updateSleepLog = (req, res) => {
  // TODO: Implement logic to update a sleep log (e.g., add endTime)
  res.json({ message: 'Update sleep log endpoint' });
};
EOF

# Create a placeholder authentication middleware
cat > ${SERVICE_DIR}/middleware/authMiddleware.js << 'EOF'
module.exports = (req, res, next) => {
  // TODO: Verify JWT token (this is a placeholder)
  next();
};
EOF

# Create the Mongoose schema for ActivityLog
cat > ${SERVICE_DIR}/models/ActivityLog.js << 'EOF'
const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  type: { type: String, required: true }, // e.g., 'sleep'
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  notes: { type: String },
  status: { type: String, default: 'open' } // 'open' or 'closed'
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
EOF

# Create sleep routes (starting point for sleep endpoints)
cat > ${SERVICE_DIR}/routes/sleepRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/activity/sleep - Create a new sleep log
router.post('/', sleepController.createSleepLog);

// GET /api/activity/sleep - Retrieve sleep logs (optionally filtered by babyId)
router.get('/', sleepController.getSleepLogs);

// GET /api/activity/sleep/incomplete/:babyId - Get an incomplete sleep log for a baby
router.get('/incomplete/:babyId', sleepController.getIncompleteSleepLog);

// PUT /api/activity/sleep/:id - Update a sleep log (e.g., to add endTime)
router.put('/:id', sleepController.updateSleepLog);

module.exports = router;
EOF

# Create an index file for routes (optional aggregator)
cat > ${SERVICE_DIR}/routes/index.js << 'EOF'
const express = require('express');
const router = express.Router();

// Here you can aggregate routes if needed
const sleepRoutes = require('./sleepRoutes');
router.use('/sleep', sleepRoutes);

module.exports = router;
EOF

# Create placeholder routes for diaper and feeding (to be expanded later)
cat > ${SERVICE_DIR}/routes/diaperRoutes.js << 'EOF'
// Placeholder for diaper routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Diaper routes placeholder' });
});

module.exports = router;
EOF

cat > ${SERVICE_DIR}/routes/feedingRoutes.js << 'EOF'
// Placeholder for feeding routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Feeding routes placeholder' });
});

module.exports = router;
EOF

# Create jest configuration
cat > ${SERVICE_DIR}/jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node'
};
EOF

# Create a sample test file
cat > ${SERVICE_DIR}/tests/sample.test.js << 'EOF'
test('sample test', () => {
  expect(1 + 1).toBe(2);
});
EOF

echo "Activity Logs microservice structure created successfully."