import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">SnuggleStats</h1>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="hidden md:flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/babies">Babies</Link>
        <Link to="/summary">Summary</Link> {/* 🆕 Added here */}
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 md:hidden">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/babies" onClick={() => setIsOpen(false)}>Babies</Link>
          <Link to="/summary" onClick={() => setIsOpen(false)}>Summary</Link> {/* 🆕 Added here */}
        </div>
      )}
    </nav>
  );
}