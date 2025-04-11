
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Calendar, PanelLeftClose } from 'lucide-react';

interface InstructorSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const InstructorSidebar: React.FC<InstructorSidebarProps> = ({ isOpen, toggleSidebar }) => {
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
        fixed inset-y-0 left-0 z-50 bg-instructor
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full pt-5 overflow-y-auto">
          <div className="flex items-center justify-between px-4 mb-6">
            <h1 className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0'}`}>
              Instructor Portal
            </h1>
            <button 
              onClick={toggleSidebar}
              className="text-white p-1 rounded-md hover:bg-instructor-light focus:outline-none"
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeftClose className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className={`flex-1 px-2 space-y-1 ${!isOpen && 'md:px-1'}`}>
            <NavLink 
              to="/instructor/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-instructor-light text-white' : 'text-instructor-foreground hover:bg-instructor-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                My Trainings
              </span>
            </NavLink>
            
            <NavLink 
              to="/instructor/schedule" 
              className={({ isActive }) => 
                `${isActive ? 'bg-instructor-light text-white' : 'text-instructor-foreground hover:bg-instructor-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Calendar className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Schedule
              </span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default InstructorSidebar;
