import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogIn, UserCircle, Calendar, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Heart className="h-7 w-7 text-red-600 transform group-hover:scale-110 transition-transform duration-200" />
              <span className="ml-2 text-lg font-bold text-gray-900">Lifesflow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/donor-registration" className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200">
              Become a Donor
            </Link>
            <Link to="/request-blood" className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200">
              Request Blood
            </Link>
            <Link to="/appointments" className="text-sm text-gray-700 hover:text-red-600 flex items-center group">
              <Calendar className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
              Appointments
            </Link>
            <Link to="/contact" className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200">
              Contact
            </Link>
            <Link to="/about-developer" className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200">
              About Developer
            </Link>
            <Link to="/admin" className="text-sm text-gray-700 hover:text-red-600 flex items-center group">
              <Shield className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
              Admin
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center text-sm text-gray-700 hover:text-red-600 group">
                  <UserCircle className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-sm text-gray-700 hover:text-red-600 group"
              >
                <LogIn className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link
              to="/donor-registration"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Donor
            </Link>
            <Link
              to="/request-blood"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Request Blood
            </Link>
            <Link
              to="/appointments"
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/about-developer"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About Developer
            </Link>
            <Link
              to="/admin"
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;