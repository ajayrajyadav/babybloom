import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bubble text-center px-4">
      <h1 className="text-5xl font-extrabold text-navy mb-4 drop-shadow">SnuggleStats</h1>
      <p className="text-lg mb-8 text-navy">Track your baby’s sleep, feeding, and diaper changes with love 💕</p>

      <div className="space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-brightpink text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-pink-500 transition"
        >
          Sign Up 🍼
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-brightpink border-2 border-brightpink px-6 py-3 rounded-2xl shadow-lg hover:bg-brightpink hover:text-white transition"
        >
          Login 👶
        </button>
      </div>
    </div>
  );
}