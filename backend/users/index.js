const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/users', authRoutes);
app.use('/users', userRoutes);

// Connect to DB
connectDB();

// If not in test mode, start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.port, () => console.log(`Users service running on port ${config.port}`));
}

module.exports = app; // Export app for testing