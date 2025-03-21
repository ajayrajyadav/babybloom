#!/bin/bash

# Navigate to the backend directory
cd ~/code/babybloom/babybloom/backend || exit

# Create baby service directory
mkdir -p babies/{models,routes,controllers,tests}
cd babies || exit

# Initialize Node.js project
echo "Initializing Node.js project..."
npm init -y

# Install dependencies
echo "Installing dependencies..."
npm install express mongoose dotenv cors body-parser
npm install --save-dev jest supertest

# Create .env file
echo "Creating .env file..."
cat <<EOL > .env
PORT=5002
MONGO_URI=mongodb://admin:password@localhost:27017/babybloom?authSource=admin
EOL

# Create index.js
echo "Creating index.js..."
cat <<EOL > index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const babyRoutes = require('./routes/babyRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/babies', babyRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected (Baby Service)'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Baby Service running on port ${PORT}`);
});
EOL

# Create Baby model
echo "Creating models/Baby.js..."
cat <<EOL > models/Baby.js
const mongoose = require('mongoose');

const BabySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Baby', BabySchema);
EOL

# Create Baby routes
echo "Creating routes/babyRoutes.js..."
cat <<EOL > routes/babyRoutes.js
const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');

// Create a baby profile
router.post('/', async (req, res) => {
  try {
    const newBaby = new Baby({ ...req.body, userId: req.body.userId });
    const savedBaby = await newBaby.save();
    res.status(201).json(savedBaby);
  } catch (error) {
    res.status(500).json({ error: 'Error creating baby profile' });
  }
});

// Get all babies for the logged-in user
router.get('/', async (req, res) => {
  try {
    const babies = await Baby.find({ userId: req.query.userId });
    res.status(200).json(babies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching baby profiles' });
  }
});

// Get a specific baby profile
router.get('/:id', async (req, res) => {
  try {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ error: 'Baby not found' });
    res.status(200).json(baby);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching baby profile' });
  }
});

// Update a baby profile
router.put('/:id', async (req, res) => {
  try {
    const updatedBaby = await Baby.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBaby);
  } catch (error) {
    res.status(500).json({ error: 'Error updating baby profile' });
  }
});

// Delete a baby profile
router.delete('/:id', async (req, res) => {
  try {
    await Baby.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Baby profile deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting baby profile' });
  }
});

module.exports = router;
EOL

# Create basic test file
echo "Creating tests/baby.test.js..."
cat <<EOL > tests/baby.test.js
const request = require('supertest');
const app = require('../index');

describe('Baby Service API Tests', () => {
  it('should create a new baby profile', async () => {
    const res = await request(app)
      .post('/api/babies/')
      .send({ name: 'Baby Test', birthdate: '2023-01-01', gender: 'Male', userId: '123456789' });
    expect(res.status).toBe(201);
  });
});
EOL

# Success message
echo "✅ Baby Service setup completed! Run 'npm start' inside the 'babies' directory to start the service."
