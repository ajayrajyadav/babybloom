#!/bin/bash

# Set up Firebase Authentication in Next.js

echo "🔥 Setting up Firebase Authentication in your Next.js project..."

# Navigate to frontend directory
cd frontend || { echo "❌ Error: frontend directory not found"; exit 1; }

# Install Firebase dependencies
echo "📦 Installing Firebase dependencies..."
npm install firebase react-firebase-hooks

# Create src directory if not exists
mkdir -p src

# Create Firebase config file
echo "📝 Creating Firebase configuration..."
cat <<EOF > src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
EOF

# Create Authentication functions
echo "📝 Adding authentication logic..."
cat <<EOF > src/auth.ts
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebaseConfig";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("GitHub sign-in error:", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
EOF

# Update Home Page to Include Sign-in Buttons
echo "📝 Updating home page..."
mkdir -p app
cat <<EOF > app/page.tsx
"use client";
import { signInWithGoogle, signInWithGithub, logout } from "../src/auth";

export default function Home() {
  return (
    <div>
      <h1>Welcome to BabyBloom</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithGithub}>Sign in with GitHub</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
EOF

# Ensure .env.local Exists
echo "📝 Setting up .env.local file..."
cat <<EOF > .env.local
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
EOF

echo "⚠️ IMPORTANT: Edit .env.local and replace placeholders with your Firebase credentials!"

# Restart the app
echo "🚀 Setup complete! Restarting the app..."
npm run dev