// src/routes/routes.jsx

import React from 'react';
import { Navigate } from 'react-router-dom'; // Used for redirects

// --- Layouts ---
import DashboardLayout from '../layouts/DashboardLayout'; // Your existing layout

// --- Pages ---
import Login from '../pages/Login/Login'; // Login page
import Register from '../pages/Register/Register'; // Register page (public)
import Dashboard from '../pages/Dashboard';
import StudyRooms from '../pages/StudyRooms';
import Achievements from '../pages/Achievements';
import Analytics from '../pages/Analytics'; // Assuming you have this page
// import Settings from '../pages/Settings'; // Assuming you have this page

// --- Import the Protected Route Component ---
import ProtectedRoute from './ProtectedRoute'; // <-- Import the component we created

export const routesArray = [
    // --- Authentication Routes (Publicly Accessible) ---
    {
        path: "/register", // Register remains public
        element: <Register />,
    },
    {
        path: "/login", // Login remains public
        element: <Login />,
    },

    // --- Protected Application Routes (Require Login) ---
    {
        // Use ProtectedRoute as the element for the parent route.
        // It will check for authentication before rendering DashboardLayout and its children.
        element: <ProtectedRoute />,
        children: [
            {
                // All routes nested under DashboardLayout are now protected
                element: <DashboardLayout />,
                children: [
                    {
                        // Make Dashboard the default page *within* the protected area
                        // This means if someone navigates to the base path of the protected layout,
                        // they land on the dashboard.
                        index: true, // Use index route for the default child
                        element: <Dashboard />,
                        // Alternatively, you could keep using path: "/dashboard"
                        // path: "/dashboard", element: <Dashboard />,
                    },
                    {
                        path: "/study-rooms",
                        element: <StudyRooms />,
                    },
                    {
                        path: "/achievements",
                        element: <Achievements />,
                    },
                    {
                        path: "/analytics", // Example protected route
                        element: <Analytics />,
                    },
                    // { path: "/settings", element: <Settings /> }, // Example protected route
                    // Add other protected routes that use DashboardLayout here
                ]
            }
        ]
    },

    // --- Redirects and Catch-alls ---
    {
        // Redirect the root path ('/') to the login page by default
        path: "/",
        element: <Navigate to="/login" replace />, // <-- CHANGED: Default route is now /login
    },
    {
        // Catch-all route: If no other route matches, redirect unauthenticated
        // users to login. Authenticated users hitting an invalid path within
        // the protected area will depend on how DashboardLayout handles unknown children.
        // You might want a specific 404 component later.
        path: "*",
        element: <Navigate to="/login" replace />, // Redirects any unmatched path to login
    }
];