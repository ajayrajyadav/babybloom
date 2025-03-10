#!/bin/bash

echo "🚀 Fixing Jest Test Errors for ES Modules..."

# Step 1: Fix Server Export in index.js
INDEX_FILE="backend/api/index.js"

if ! grep -q "export default server" "$INDEX_FILE"; then
  echo "🔧 Updating $INDEX_FILE to return an HTTP server..."
  sed -i '' 's|const app = express();|import http from "http";\nconst app = express();\nconst server = http.createServer(app);|' "$INDEX_FILE"
  sed -i '' 's|app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));|if (process.env.NODE_ENV !== "test") {\n  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));\n}|' "$INDEX_FILE"
  echo "export default server;" >> "$INDEX_FILE"
fi

# Step 2: Fix MongoDB Connection Logging
DB_FILE="backend/api/config/db.js"
if ! grep -q "if (process.env.NODE_ENV !== 'test')" "$DB_FILE"; then
  echo "🔧 Suppressing MongoDB logs during tests..."
  sed -i '' 's|console.log(`✅ MongoDB Connected: \${conn.connection.host}`);|if (process.env.NODE_ENV !== "test") console.log(`✅ MongoDB Connected: \${conn.connection.host}`);|' "$DB_FILE"
fi

# Step 3: Ensure MongoDB Closes After Tests
TEST_SETUP="backend/api/tests/setup.js"
echo "🔧 Ensuring MongoDB disconnects after tests..."
cat <<EOL > "$TEST_SETUP"
import mongoose from 'mongoose';
afterAll(async () => {
  await mongoose.connection.close();
});
EOL

# Step 4: Update Jest Config
JEST_CONFIG="jest.config.js"
if [ ! -f "$JEST_CONFIG" ]; then
  echo "🔧 Creating Jest config to enable ESM support..."
  cat <<EOL > "$JEST_CONFIG"
export default {
  preset: 'jest-puppeteer',
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  setupFilesAfterEnv: ['<rootDir>/backend/api/tests/setup.js']
};
EOL
fi

# Step 5: Run Tests
echo "🛠 Running Jest Tests with ES Modules support..."
NODE_ENV=test NODE_OPTIONS="--experimental-vm-modules" npm test

echo "✅ Jest ES Module Fix Applied Successfully!"