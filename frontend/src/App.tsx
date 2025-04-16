import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Login from './pages/Loging';
import Babies from './pages/Babies';
import AddActivity from './pages/AddActivity';
import Navbar from './components/Navbar'; // <-- 🧩 Import the Navbar
import Summary from './pages/Summary'; 

function App() {
  const location = useLocation();
  const hideNavbarOn = ['/', '/login', '/signup'];

  return (
    <>
      {/* ✅ Conditionally show Navbar */}
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/babies" element={<Babies />} />
        <Route path="/activity" element={<AddActivity />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;