#!/bin/bash

set -e

echo "🔧 Creating frontend folder for Babybloom (SnuggleStats UI)..."

cd /Users/ajayyadav/code/babybloom/babybloom
npm create vite@latest frontend -- --template react-ts
cd frontend

echo "📦 Installing dependencies..."
pnpm install
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "⚙️ Configuring Tailwind..."
cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

echo "🧼 Cleaning up starter files..."
rm -f src/App.css src/index.css src/App.tsx src/main.tsx

echo "🎨 Creating custom Tailwind styles..."
cat > src/index.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

echo "📁 Creating basic project structure..."
mkdir -p src/pages

# main.tsx
cat > src/main.tsx <<EOL
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOL

# App.tsx
cat > src/App.tsx <<EOL
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
EOL

# SplashScreen.tsx
cat > src/pages/SplashScreen.tsx <<EOL
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 text-center">
      <h1 className="text-4xl font-bold mb-4">SnuggleStats</h1>
      <p className="mb-8">Track your baby’s sleep, feeding, and diaper changes with love 💕</p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-purple-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-purple-600"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="bg-white text-purple-500 border border-purple-300 px-6 py-2 rounded-full shadow-md hover:bg-purple-50"
        >
          Login
        </button>
      </div>
    </div>
  );
}
EOL

# SignUp.tsx
cat > src/pages/SignUp.tsx <<EOL
import React from 'react';

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h2 className="text-2xl font-semibold mb-6">Create Your Account</h2>
      <form className="w-full max-w-sm space-y-4">
        <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
EOL

# Dashboard.tsx
cat > src/pages/Dashboard.tsx <<EOL
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Babies</h2>
      <div className="border p-4 rounded mb-4">
        <div className="flex justify-between items-center">
          <span>👶 Ava</span>
          <div className="space-x-2">
            <button className="text-sm text-blue-600">Rename</button>
            <button className="text-sm text-red-500">Delete</button>
          </div>
        </div>
        <button className="mt-2 text-sm text-purple-600">+ Add Activity</button>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded-full">+ Add New Baby</button>
    </div>
  );
}
EOL

echo "✅ SnuggleStats UI scaffolded inside frontend/"
echo "👉 To start: cd frontend && pnpm dev"