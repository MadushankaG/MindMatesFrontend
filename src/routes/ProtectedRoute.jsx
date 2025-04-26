// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Added useLocation

/**
 * A component that checks for an authentication token in localStorage.
 * If a token exists, it renders the nested child routes (using Outlet).
 * If no token exists, it redirects the user to the /login page.
 */
const ProtectedRoute = () => {
    const location = useLocation(); // Get current location for logging

    // Check for the token in localStorage
    const token = localStorage.getItem('token');
    console.log(`[ProtectedRoute] Checking for token at path: ${location.pathname}. Token found:`, !!token); // Log token status

    if (!token) {
        // If no token, redirect to the login page
        console.log("[ProtectedRoute] No token found, redirecting to /login");
        // Pass the current location state so login page can redirect back after success (optional)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If token exists, render the child component (the actual protected page via Outlet)
    console.log("[ProtectedRoute] Token found, rendering Outlet.");
    return <Outlet />; // Outlet renders the matched child route (e.g., DashboardLayout)
};

export default ProtectedRoute;
