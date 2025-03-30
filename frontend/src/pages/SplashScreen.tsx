
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
