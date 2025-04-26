// src/routes/routes.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// --- Layouts ---
import DashboardLayout from '../layouts/DashboardLayout'; // Import the layout

// --- Pages ---
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard';
import StudyRooms from '../pages/StudyRooms';
import Achievements from '../pages/Achievements';
// Import other pages as needed (Analytics, Settings)

// --- Protected Route Component ---
import ProtectedRoute from './ProtectedRoute';
import StudyRoomDetail from "../pages/StudyRoomDetail.jsx"; // Import the protection component

export const routesArray = [
    // --- Authentication Routes (Publicly Accessible) ---
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },

    // --- Protected Application Routes (Require Login) ---
    {
        // Use ProtectedRoute as the parent element for routes requiring authentication.
        // It will check for a token before rendering its children.
        element: <ProtectedRoute />,
        children: [
            {
                // Use DashboardLayout for the structure of authenticated pages.
                // This is now nested *inside* ProtectedRoute.
                element: <DashboardLayout />,
                // Define the actual protected pages as children of DashboardLayout.
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/study-rooms",
                        element: <StudyRooms />,
                    },
                    {
                        path: "/study-rooms/:roomId",
                        element: <StudyRoomDetail />,
                    },
                    {
                        path: "/achievements",
                        element: <Achievements />,
                    },
                    // Add routes for Analytics, Settings etc. here inside this children array
                    // { path: "/analytics", element: <Analytics /> },
                    // { path: "/settings", element: <Settings /> },

                    // Optional: Redirect from the root within the protected layout if needed.
                    // If someone manually navigates to just '/' after logging in,
                    // this could redirect them to '/dashboard'.
                    // However, the top-level redirect to /login usually handles the initial entry.
                    // {
                    //     path: "/", // Handles requests to the root *within* the protected section
                    //     element: <Navigate to="/dashboard" replace />,
                    // }
                ]
            }
            // If you had other top-level protected routes that *don't* use DashboardLayout,
            // they would go here as siblings of the DashboardLayout element object.
        ]
    },
    // --- End Protected Application Routes ---


    // --- Redirects and Catch-alls ---
    {
        // Default route redirects to LOGIN page if no other route matches
        // and the user isn't hitting a protected route yet.
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    // {
    //     // Example: A catch-all 404 route (implement NotFoundPage component)
    //     path: "*",
    //     element: <NotFoundPage />,
    // }
];
