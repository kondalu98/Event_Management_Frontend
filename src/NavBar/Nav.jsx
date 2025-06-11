import { Menu, X } from 'lucide-react'; // You can use heroicons or lucide-react for icons
import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">Eventify</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="/" className="hover:text-gray-200">Home</a>
            <Link to="/events" className="hover:text-gray-200">Events</Link>
            <a href="/tickets" className="hover:text-gray-200">My Tickets</a>
            <a href="/feedback" className="hover:text-gray-200">Feedback</a>
            <Link to="/login" className="hover:text-gray-200">Login / Register</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleNavbar}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <a href="/" className="block px-2 py-1 hover:bg-blue-700 rounded">Home</a>
            <a href="/events" className="block px-2 py-1 hover:bg-blue-700 rounded">Events</a>
            <a href="/tickets" className="block px-2 py-1 hover:bg-blue-700 rounded">My Tickets</a>
            <a href="/feedback" className="block px-2 py-1 hover:bg-blue-700 rounded">Feedback</a>
            <a href="/login" className="block px-2 py-1 hover:bg-blue-700 rounded">Login / Register</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
