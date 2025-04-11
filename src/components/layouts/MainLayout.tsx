
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import EmployerSidebar from './EmployerSidebar';
import InstructorSidebar from './InstructorSidebar';
import UserSidebar from './UserSidebar';
import Navbar from '../navigation/Navbar';
import { PanelLeftClose } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check local storage for sidebar preference on initial load
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === 'true');
    }
  }, []);

  // Save sidebar state to local storage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', sidebarOpen.toString());
  }, [sidebarOpen]);

  // Determine which sidebar to show based on user role
  const renderSidebar = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />;
      case 'employer':
        return <EmployerSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />;
      case 'instructor':
        return <InstructorSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />;
      case 'participant':
        return <UserSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {renderSidebar()}
      
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'}`}>
        <Navbar />
        <div className="px-4 py-2 md:hidden">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <PanelLeftClose className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>
        <main className="relative">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
