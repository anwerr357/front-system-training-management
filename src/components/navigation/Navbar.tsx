
import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Set background color based on user role
  const getBgColor = () => {
    if (!user) return 'bg-primary';
    switch (user.role) {
      case 'admin':
        return 'bg-admin';
      case 'employer':
        return 'bg-employer';
      case 'instructor':
        return 'bg-instructor';
      case 'participant':
        return 'bg-participant';
      default:
        return 'bg-primary';
    }
  };

  return (
    <nav className={`${getBgColor()} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex md:hidden items-center">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-opacity-75 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex items-center ml-4 md:ml-0">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="text-white font-medium">
                    Welcome, {user?.name}
                  </div>
                  <div className="text-white text-sm opacity-80 capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              type="button" 
              className="p-2 rounded-full text-white hover:bg-opacity-75 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="ml-3 relative">
              <div>
                <button 
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-700">
                    <User className="h-6 w-6" />
                  </div>
                </button>
              </div>
              
              {userDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
