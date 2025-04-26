// src/layouts/DashboardLayout.jsx
import React, { useEffect } from 'react'; // Added useEffect
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

const DashboardLayout = () => {
    // Log when the layout mounts
    useEffect(() => {
        console.log("[DashboardLayout] Component Mounted");
    }, []);

    return (
        <div className="flex h-screen bg-slate-800">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Log before rendering Outlet */}
                {console.log("[DashboardLayout] Rendering Outlet...")}
                <Outlet /> {/* Child routes (like Dashboard page) render here */}
            </main>
        </div>
    );
};

export default DashboardLayout;
