// src/routes/routes.jsx

import React from 'react';
import { Navigate } from 'react-router-dom'; // Useful for redirects

// --- Layouts ---
import DashboardLayout from '../layouts/DashboardLayout'; // Import the layout

// --- Pages ---
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard';
import StudyRooms from '../pages/StudyRooms';
import Achievements from '../pages/Achievements'; // <-- 1. Import the Achievements page

// Import other pages as needed
// import Analytics from '../pages/Analytics';
// import Settings from '../pages/Settings';
// import ErrorPage from '../pages/ErrorPage'; // Optional error page

export const routesArray = [
    // --- Authentication Routes (No Sidebar Layout) ---
    {
        path: "/register",
        element: <Register />,
        // errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <Login />,
        // errorElement: <ErrorPage />,
    },

    // --- Main Application Routes (With Sidebar Layout) ---
    {
        // Parent route using the layout
        element: <DashboardLayout />,
        // errorElement: <ErrorPage />, // Optional: Add error element to the layout route
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                 path: "/study-rooms",
                 element: <StudyRooms />,
            },
            { // <-- 2. Added route object for Achievements
                path: "/achievements",
                element: <Achievements />,
                // errorElement: <ErrorPage />, // Optional
            },
            // Add routes for Analytics, Settings etc. here later
            // { path: "/analytics", element: <Analytics /> },
            // { path: "/settings", element: <Settings /> },
        ],
    },

    // --- Redirects and Catch-alls (Optional but Recommended) ---
    {
        // Redirect the root path ('/') to the dashboard
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    // {
    //     // Example: A catch-all 404 route
    //     path: "*",
    //     // element: <NotFoundPage /> // You would create a NotFoundPage component
    // }
];
