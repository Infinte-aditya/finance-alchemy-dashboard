
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  BarChart3, 
  CreditCard, 
  Home, 
  LogOut, 
  Menu, 
  TrendingUp, 
  User, 
  X
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: <AreaChart className="h-5 w-5" /> },
  { path: '/dashboard/investments', label: 'Investments', icon: <TrendingUp className="h-5 w-5" /> },
  { path: '/dashboard/expenses', label: 'Expenses', icon: <CreditCard className="h-5 w-5" /> },
  { path: '/dashboard/insights', label: 'Insights', icon: <BarChart3 className="h-5 w-5" /> },
  { path: '/dashboard/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

interface NavbarProps {
  variant?: 'default' | 'dashboard';
}

const Navbar = ({ variant = 'default' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isDashboard = variant === 'dashboard';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isDashboard ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b" : 
      location.pathname === '/' ? "bg-transparent" : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <Home className="h-6 w-6" />
              <span className="font-medium text-lg">Finance Alchemy</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isDashboard ? (
              <>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200",
                      location.pathname === item.path 
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2">
                  Home
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2">
                      Dashboard
                    </Link>
                    <Button onClick={logout} variant="secondary">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2">
                      Login
                    </Link>
                    <Link to="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="ml-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-[400px] border-b" : "max-h-0"
      )}>
        <div className="px-4 pt-2 pb-4 space-y-1">
          {isDashboard ? (
            <>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="block px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
