
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, BarChart } from 'lucide-react';

const UserSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 bg-participant overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-white">Training Portal</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            <NavLink 
              to="/user/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-participant-light text-white' : 'text-participant-foreground hover:bg-participant-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Available Trainings
            </NavLink>
            
            <NavLink 
              to="/user/progress" 
              className={({ isActive }) => 
                `${isActive ? 'bg-participant-light text-white' : 'text-participant-foreground hover:bg-participant-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BarChart className="mr-3 h-5 w-5" />
              My Progress
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
