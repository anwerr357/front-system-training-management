
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Calendar } from 'lucide-react';

const InstructorSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 bg-instructor overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-white">Instructor Portal</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            <NavLink 
              to="/instructor/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-instructor-light text-white' : 'text-instructor-foreground hover:bg-instructor-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              My Trainings
            </NavLink>
            
            <NavLink 
              to="/instructor/schedule" 
              className={({ isActive }) => 
                `${isActive ? 'bg-instructor-light text-white' : 'text-instructor-foreground hover:bg-instructor-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Calendar className="mr-3 h-5 w-5" />
              Schedule
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default InstructorSidebar;
