import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileStack, Edit3, LogOut, Menu, X, Leaf } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, public: true },
    ...(isAuthenticated ? [
      { path: '/my-sessions', label: 'My Sessions', icon: FileStack, public: false },
      { path: '/editor', label: 'Editor', icon: Edit3, public: false },
    ] : []),
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-wellness-primary">
                  WellnessSession
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar-link flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                      isActive(link.path)
                        ? 'text-primary-500 bg-primary-50'
                        : 'text-wellness-secondary hover:text-primary-500'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Auth Actions */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Link to="/login">
                      <Button variant="secondary" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-wellness-secondary hover:text-primary-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? 'text-primary-500 bg-primary-100'
                        : 'text-wellness-secondary hover:text-primary-500 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Actions */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="px-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLogout}
                      icon={<LogOut className="w-4 h-4" />}
                      className="w-full justify-center"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 space-y-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full justify-center">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;


