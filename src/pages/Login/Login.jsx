// src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import the actual userLogin function from your API file
// This function currently targets POST /auth/login based on the existing code.
import { userLogin } from '../../api/apiUser';

// 2. Import assets using relative paths
import loginBackground from '../../assets/images/Background.png'; // Background
import logoSrc from '../../assets/images/logo.png';           // Logo
import mascotImage from '../../assets/images/login.svg'; // Mascot

// --- Placeholder for a real notification function ---
// TODO: Replace this with your actual notification implementation (e.g., Ant Design)
const showNotification = (type, title, description) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    // Example using alert (replace this)
    alert(`${title}: ${description}`);
};
// --- End Placeholder ---

const Login = () => {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState(false); // Loading state
    const [emailOrUsername, setEmailOrUsername] = useState(''); // State for email or username input
    const [password, setPassword] = useState('');

    // Handle Login Submission
    const handleFinish = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setButtonState(true); // Set loading state

        try {
            // Call the imported userLogin function from apiUser.js
            // It expects email/username and password, and handles tokens internally
            const response = await userLogin(emailOrUsername, password);

            // Check if login seems successful based on expected response structure
            // (userLogin in apiUser.js checks for response.data.id and sets tokens)
            if (response && response.data && response.data.id) {
                console.log('Login successful, navigating to dashboard...');
                navigate('/dashboard'); // Navigate on successful login
            } else {
                // Handle cases where the API might return a 2xx status but not the expected data
                const message = response?.data?.message || 'Login failed. Unexpected response from server.';
                showNotification('error', 'Login Failed', message);
                setButtonState(false);
            }

        } catch (error) {
            // Handle errors thrown by the API call (network, 4xx, 5xx)
            console.error('Login error:', error);

            let errorMessage = 'An error occurred during login.'; // Default message

            // Check for specific status codes based on API documentation
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data || error.message; // Use message from response if available
                if (error.response.status === 401) {
                    errorMessage = 'Incorrect username or password.';
                } else if (error.response.status === 409) {
                    // Assuming 409 means account not activated as per docs
                    errorMessage = 'Account not activated. Please verify your email.';
                }
            } else {
                // Handle network errors
                errorMessage = error.message || errorMessage;
            }

            showNotification('error', 'Login Failed', errorMessage);
            setButtonState(false); // Reset button state on error
        }
    };

    // Inline style for the background image
    const backgroundStyle = {
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div
            className="min-h-screen w-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden"
            style={backgroundStyle}
        >
            {/* Logo */}
            <img
                src={logoSrc}
                alt="Mind Mates Logo"
                className="h-16 md:h-20 w-auto mb-4 relative z-10"
            />

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8 relative z-10">
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold font-heading text-center text-gray-800 mb-6">
                    Welcome Back!
                </h1>

                {/* Login Form */}
                <form onSubmit={handleFinish} className="space-y-4">
                    {/* Email or Username Input */}
                    <div>
                        <label
                            htmlFor="emailOrUsername" // Changed id and htmlFor
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email or Username
                        </label>
                        <input
                            // Using type="text" allows both email and username
                            type="text"
                            id="emailOrUsername" // Changed id
                            name="emailOrUsername" // Changed name
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)} // Update correct state
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="you@example.com or username"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={buttonState}
                        // Use brand colors if defined, otherwise fallback to blue
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white ${
                            buttonState
                                ? 'bg-blue-400 cursor-not-allowed' // Disabled/loading style
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' // Normal style
                        }`}
                    >
                        {buttonState ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Links Section */}
                    <div className="flex justify-between items-center text-sm mt-4">
                        <Link // Changed from <a> to <Link> for internal routing
                            to="/forgot-password" // Link to your forgot password route
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Forgot Password?
                        </Link>
                        <Link
                            to="/register" // Link to the registration page
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Don't have an account?
                        </Link>
                    </div>
                </form>
            </div>

            {/* Mascot Image */}
            <img
                src={mascotImage}
                alt="Mascot"
                className="absolute bottom-0 right-0 h-40 md:h-60 w-auto z-0 pointer-events-none hidden lg:block"
            />
        </div>
    );
}

export default Login;
