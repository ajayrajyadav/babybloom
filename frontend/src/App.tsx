
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Login from './pages/Loging';
import Babies from "./pages/Babies";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/babies" element={<Babies />} />
    </Routes>
  );
}

export default App;
