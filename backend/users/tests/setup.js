const mongoose = require("mongoose");
const User = require("../models/userModel");
const RefreshTokenModel = require("../models/refreshTokenModel");
require("dotenv").config(); // Load environment variables

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clean up the database before running tests
    console.log("🧹 Cleaning up database before running tests...");
    await User.deleteMany({});
    await RefreshTokenModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB after tests");
});