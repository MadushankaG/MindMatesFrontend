// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from '../components/Sidebar/Sidebar'; // Adjust path if necessary

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-800"> {/* Base background for the whole screen */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto"> {/* Main content area */}
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;