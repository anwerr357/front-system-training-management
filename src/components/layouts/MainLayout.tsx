
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import EmployerSidebar from './EmployerSidebar';
import InstructorSidebar from './InstructorSidebar';
import UserSidebar from './UserSidebar';
import Navbar from '../navigation/Navbar';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  // Determine which sidebar to show based on user role
  const renderSidebar = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminSidebar />;
      case 'employer':
        return <EmployerSidebar />;
      case 'instructor':
        return <InstructorSidebar />;
      case 'participant':
        return <UserSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {renderSidebar()}
      
      <div className="flex-1 overflow-auto">
        <Navbar />
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
