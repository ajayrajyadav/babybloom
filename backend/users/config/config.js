require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5001,
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    mongoURI: process.env.MONGO_URI || "mongodb://admin:password@babybloom-mongo:27017/usersdb?authSource=admin",
};
