// src/pages/Login/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import the actual userLogin function from your API file
import { userLogin } from '../../api/apiUser'; 

// 2. Import assets using relative paths
import loginBackground from '../../assets/images/Background.png'; // Background
import logoSrc from '../../assets/images/logo.png';           // Use the PNG logo
import mascotImage from '../../assets/images/login.svg'; // Assuming mascot is this SVG, ADJUST IF NEEDED

// Placeholder for a real notification function (replace with your actual implementation)
const showNotification = (type, title, description) => {
  console.log(`Notification (${type}): ${title} - ${description}`);
  // Replace alert with your actual notification call (e.g., Ant Design's notification.error)
  alert(`${title}: ${description}`);
};

const Login = () => {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState(false);
    const [email, setEmail] = useState(''); // Can be email or username
    const [password, setPassword] = useState('');

    const handleFinish = async (event) => {
        event.preventDefault();
        setButtonState(true);
        try {
            // Call the imported userLogin function
            // It should handle setting localStorage/Cookies internally
            const response = await userLogin(email, password);

            // Check if login seems successful based on expected response structure
            if (response && response.data && response.data.id) {
                 console.log('Login successful, navigating...');
                 navigate('/dashboard'); // Navigate to dashboard
            } else {
                // Handle cases where API returns success status but no ID/token
                showNotification('error', 'Login Failed', response?.data?.message || 'Invalid response from server.');
                setButtonState(false);
            }

        } catch (error) {
            // Handle errors thrown by the API call (network, 4xx, 5xx)
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login.';
            showNotification('error', 'Login Failed', errorMessage);
            setButtonState(false); // Reset button state on error
        }
    };

    // Inline style for the background
    const backgroundStyle = {
      backgroundImage: `url(${loginBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    return (
        <div
          className="min-h-screen w-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden" // Added relative and overflow-hidden
          style={backgroundStyle}
        >
            {/* Logo above the card */}
            <img
                src={logoSrc} // Use the PNG logo
                alt="Mind Mates Logo"
                className="h-16 md:h-20 w-auto mb-4 relative z-10" // Consistent sizing with Register page
            />

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8 relative z-10">
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold font-heading text-center text-gray-800 mb-6">
                    Welcome Back!
                </h1>

                <form onSubmit={handleFinish} className="space-y-4">
                    {/* Email or Username Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Or Username
                        </label>
                        <input
                            // Using type="text" allows username, use "email" if API only accepts email
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        // Using generic blue, replace 'bg-blue-600' etc. with your 'bg-brand-medium' if defined
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white ${
                            buttonState
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {buttonState ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Links Section */}
                    <div className="flex justify-between items-center text-sm mt-4">
                        <a
                            href="#" // Replace with actual link or modal trigger for password reset
                            className="font-medium text-blue-600 hover:text-blue-500" // Adjust color as needed
                        >
                            Forgot Password?
                        </a>
                        <Link
                            to="/register" // Link to the registration page
                            className="font-medium text-blue-600 hover:text-blue-500" // Adjust color as needed
                        >
                            Don't have an account?
                        </Link>
                    </div>
                </form>
            </div>

             {/* Mascot Image - Positioned bottom right */}
            <img
                 src={mascotImage} // Assuming this is the owl mascot
                 alt="Mascot"
                 className="absolute bottom-0 right-0 h-40 md:h-60 w-auto z-0 pointer-events-none hidden lg:block" // Positioned bottom right, behind card, hidden on small screens
            />
        </div>
    );
}

export default Login;