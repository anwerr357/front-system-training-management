import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, BookOpen, GraduationCap, Building2, UserCog, FolderKanban, UserCircle, Layers3, PanelLeftClose, InboxIcon } from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
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
        fixed inset-y-0 left-0 z-50 bg-admin
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full pt-5 overflow-y-auto">
          <div className="flex items-center justify-between px-4 mb-6">
            <h1 className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0'}`}>
              Training Admin
            </h1>
            <button 
              onClick={toggleSidebar}
              className="text-white p-1 rounded-md hover:bg-admin-light focus:outline-none"
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeftClose className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
          
          <nav className={`flex-1 px-2 space-y-1 ${!isOpen && 'md:px-1'}`}>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Dashboard
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/requests" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <InboxIcon className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Requests
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/trainings" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Trainings
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/participants" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Users className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Participants
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/instructors" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Instructors
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/employers" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Building2 className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Employers
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <UserCog className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Users
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/structures" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Structures
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/profiles" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <UserCircle className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Profiles
              </span>
            </NavLink>
            
            <NavLink 
              to="/admin/domains" 
              className={({ isActive }) => 
                `${isActive ? 'bg-admin-light text-white' : 'text-admin-foreground hover:bg-admin-light'} 
                group flex items-center px-2 py-2 text-sm font-medium rounded-md`
              }
            >
              <Layers3 className="mr-3 h-5 w-5" />
              <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:h-0 md:overflow-hidden'}`}>
                Domains
              </span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
