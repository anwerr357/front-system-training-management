
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, GraduationCap } from 'lucide-react';

const EmployerSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 bg-employer overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-white">Employer Portal</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            <NavLink 
              to="/employer/dashboard" 
              className={({ isActive }) => 
                `${isActive ? 'bg-employer-light text-white' : 'text-employer-foreground hover:bg-employer-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/employer/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-employer-light text-white' : 'text-employer-foreground hover:bg-employer-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Trainings
            </NavLink>
            
            <NavLink 
              to="/employer/instructors" 
              className={({ isActive }) => 
                `${isActive ? 'bg-employer-light text-white' : 'text-employer-foreground hover:bg-employer-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              Instructors
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default EmployerSidebar;
