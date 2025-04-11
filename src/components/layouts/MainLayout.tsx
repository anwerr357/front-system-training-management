
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../navigation/Navbar';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
