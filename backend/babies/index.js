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
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('✅ MongoDB Connected (Baby Service)'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log();
});
