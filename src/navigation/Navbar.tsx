
import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, BookOpen, BarChart3, Users, GraduationCap, Building2, UserCog, FolderKanban, UserCircle, Layers3, Pencil, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const getBgColor = () => {
    if (!user) return 'bg-blue-500';
    switch (user.role) {
      case 'admin':
        return 'bg-blue-700';
      case 'employer':
        return 'bg-blue-600';
      case 'instructor':
        return 'bg-blue-500';
      case 'participant':
        return 'bg-blue-400';
      default:
        return 'bg-blue-500';
    }
  };

  const getNavLinks = () => {
    if (!user) return [];
    console.log("userRole: ", user.role);
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: <BarChart3 className="h-5 w-5 mr-2" />, label: 'Dashboard' },
          { to: '/admin/enrollments', icon: <Pencil className="h-5 w-5 mr-2" />, label: 'Enrollments' },
          { to: '/admin/trainings', icon: <BookOpen className="h-5 w-5 mr-2" />, label: 'Trainings' },
          { to: '/admin/participants', icon: <Users className="h-5 w-5 mr-2" />, label: 'Participants' },
          { to: '/admin/instructors', icon: <GraduationCap className="h-5 w-5 mr-2" />, label: 'Instructors' },
          { to: '/admin/employers', icon: <Building2 className="h-5 w-5 mr-2" />, label: 'Employers' },
          { to: '/admin/users', icon: <UserCog className="h-5 w-5 mr-2" />, label: 'Users' },
          { to: '/admin/structures', icon: <FolderKanban className="h-5 w-5 mr-2" />, label: 'Structures' },
          { to: '/admin/profiles', icon: <UserCircle className="h-5 w-5 mr-2" />, label: 'Profiles' },
          { to: '/admin/domains', icon: <Layers3 className="h-5 w-5 mr-2" />, label: 'Domains' }
        ];
      case 'employer':
        return [
          { to: '/employer/dashboard', icon: <BarChart3 className="h-5 w-5 mr-2" />, label: 'Dashboard' },
          { to: '/employer/trainings', icon: <BookOpen className="h-5 w-5 mr-2" />, label: 'Trainings' },
          { to: '/employer/instructors', icon: <GraduationCap className="h-5 w-5 mr-2" />, label: 'Instructors' },
          { to: '/employer/reports', icon: <FileText className="h-5 w-5 mr-2" />, label: 'Reports' }
        ];
      case 'instructor':
        return [
          { to: '/instructor/trainings', icon: <BookOpen className="h-5 w-5 mr-2" />, label: 'My Trainings' },
          { to: '/instructor/schedule', icon: <Calendar className="h-5 w-5 mr-2" />, label: 'Schedule' }
        ];
      case 'participant':
        return [
          { to: '/user/trainings', icon: <BookOpen className="h-5 w-5 mr-2" />, label: 'Available Trainings' },
          { to: '/user/progress', icon: <BarChart3 className="h-5 w-5 mr-2" />, label: 'My Progress' }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div>
      <nav className={`${getBgColor()} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                type="button" 
                onClick={() => setNavOpen(!navOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-opacity-75 focus:outline-none"
              >
                <span className="sr-only">{navOpen ? 'Close menu' : 'Open menu'}</span>
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
              
              <div className="ml-3 flex items-center">
                <div className="text-white font-medium">
                  Welcome, {user?.name}
                </div>
                <div className="ml-3 text-white text-sm opacity-80 capitalize">
                  {user?.role}
                </div>
              </div>
              
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.to}
                    to={link.to} 
                    className={({ isActive }) => 
                      `${isActive ? 'bg-opacity-30 font-bold' : 'hover:bg-opacity-10'} 
                      bg-white bg-opacity-0 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                ))}
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
      
      {navOpen && (
        <div className="md:hidden">
          <div className={`${getBgColor()} bg-opacity-95 shadow-lg rounded-b-lg`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) => 
                    `${isActive ? 'bg-opacity-30 font-bold' : 'hover:bg-opacity-10'} 
                    bg-white bg-opacity-0 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
