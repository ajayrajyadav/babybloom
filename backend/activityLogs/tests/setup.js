// tests/setup.js
const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🧪 Connected to MongoDB for activity tests");

  // Wait until .db is ready
  if (!mongoose.connection.db) {
    throw new Error("MongoDB not connected properly");
  }

  console.log("🧹 Cleaning up activity logs before running tests...");
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("🔌 Disconnected from MongoDB after activity tests");
});