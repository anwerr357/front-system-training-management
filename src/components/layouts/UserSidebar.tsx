
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, BarChart, PanelLeftClose } from 'lucide-react';

interface UserSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <div className={`
        fixed inset-y-0 left-0 z-50 bg-participant
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full pt-5 overflow-y-auto">
          <div className="flex items-center justify-between px-4 mb-6">
            <h1 className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0'}`}>
              Training Portal
            </h1>
            <button 
              onClick={toggleSidebar}
              className="text-white p-1 rounded-md hover:bg-participant-light focus:outline-none"
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeftClose className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className={`flex-1 px-2 space-y-1 ${!isOpen && 'md:px-1'}`}>
            <NavLink 
              to="/user/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-participant-light text-white' : 'text-participant-foreground hover:bg-participant-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="h-5 w-5 mr-3" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Available Trainings
              </span>
            </NavLink>
            
            <NavLink 
              to="/user/progress" 
              className={({ isActive }) => 
                `${isActive ? 'bg-participant-light text-white' : 'text-participant-foreground hover:bg-participant-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BarChart className="h-5 w-5 mr-3" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                My Progress
              </span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
