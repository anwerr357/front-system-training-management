
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, BookOpen, GraduationCap, Building2, UserCog, FolderKanban, UserCircle, Layers3 } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 bg-admin overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-white">Training Admin</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/admin/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Trainings
            </NavLink>
            
            <NavLink 
              to="/admin/participants" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Users className="mr-3 h-5 w-5" />
              Participants
            </NavLink>
            
            <NavLink 
              to="/admin/instructors" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              Instructors
            </NavLink>
            
            <NavLink 
              to="/admin/employers" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Building2 className="mr-3 h-5 w-5" />
              Employers
            </NavLink>
            
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <UserCog className="mr-3 h-5 w-5" />
              Users
            </NavLink>
            
            <NavLink 
              to="/admin/structures" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              Structures
            </NavLink>
            
            <NavLink 
              to="/admin/profiles" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <UserCircle className="mr-3 h-5 w-5" />
              Profiles
            </NavLink>
            
            <NavLink 
              to="/admin/domains" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                 group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Layers3 className="mr-3 h-5 w-5" />
              Domains
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
