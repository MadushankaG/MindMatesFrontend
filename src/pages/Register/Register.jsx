// src/pages/Register/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import images using relative paths from within src
import loginBackground from '../../assets/images/Background.png'; // Relative path for background
import logoSrc from '../../assets/images/logo.png';           // Relative path for logo
import mascotImage from '../../assets/images/login.svg'; // Assuming the mascot is this SVG

// 2. Import the updated userRegister function from your API file
import { userRegister } from '../../api/apiUser';

// --- Placeholder for a real notification function ---
// TODO: Replace this with your actual notification implementation (e.g., Ant Design)
const showNotification = (type, title, description) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    // Example using alert (replace this)
    alert(`${title}: ${description}`);
};
// --- End Placeholder ---

const Register = () => {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState(false); // Loading state for the button

    // State for form fields based on the form structure and API requirements
    const [name, setName] = useState(''); // Optional field
    const [username, setUsername] = useState(''); // Required field
    const [email, setEmail] = useState(''); // Required field
    const [password, setPassword] = useState(''); // Required field
    const [confirmPassword, setConfirmPassword] = useState(''); // For confirmation check

    // Handle Registration Submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic client-side validation: Check if passwords match
        if (password !== confirmPassword) {
            showNotification('error', 'Registration Failed', 'Passwords do not match.');
            return; // Stop submission if passwords don't match
        }

        setButtonState(true); // Set button to loading state

        try {
            // Prepare data object for the API call based on userRegister function requirements
            const values = {
                username: username, // Required
                email: email,       // Required
                password: password, // Required
            };

            console.log(values);

            // Call the imported userRegister function with the prepared data
            // The function now sends the correct fields to the documented endpoint
            await userRegister(values);

            console.log("wada natte fucntion eka");

            // Show success notification
            showNotification(
                'success',
                'Registration Successful',
                'Please check your email for a verification link, then log in.'
            );

            // Redirect to login page after successful registration
            navigate('/login');

        } catch (error) {
            // Handle errors from the API call
            console.error('Registration error:', error);

            let errorMessage = 'An error occurred during registration.'; // Default error message

            // Check if the error response exists and has data
            if (error.response) {
                // Use specific message from API if available (e.g., validation errors)
                // The API doc mentions a string body for 409, use that if present
                errorMessage = error.response.data || error.message;

                // Handle specific 409 Conflict error as per API documentation
                if (error.response.status === 409) {
                    errorMessage = 'Username or Email already exists. Please try different ones.';
                }
            } else {
                // Handle network errors or other issues where response might be undefined
                errorMessage = error.message || errorMessage;
            }

            // Show error notification to the user
            showNotification('error', 'Registration Failed', errorMessage);

            setButtonState(false); // Reset button state only on error
        }
        // No 'finally' block needed here, as successful navigation handles the state change implicitly.
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

            {/* Registration Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8 relative z-10">
                <h1 className="text-xl md:text-2xl font-bold font-heading text-center text-gray-800 mb-6">
                    Welcome to Mind Mates
                </h1>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name Input (Optional) */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                        <input
                            type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Your Full Name"
                        />
                    </div>

                    {/* Username Input (Required) */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Choose a Username"
                        />
                    </div>

                    {/* Email Input (Required) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Input (Required) */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Create a Password"
                        />
                    </div>

                    {/* Confirm Password Input (Required for validation) */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm Your Password"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={buttonState} // Disable button when loading
                        // Use brand colors if defined in tailwind.config.js, otherwise fallback to generic blue
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white ${
                            buttonState
                                ? 'bg-blue-400 cursor-not-allowed' // Style for disabled/loading state
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' // Normal state styles
                        }`}
                    >
                        {buttonState ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    {/* Link to Login Page */}
                    <div className="text-sm text-center mt-4">
                        <Link
                            to="/login" // Navigate to the login route
                            className="font-medium text-blue-600 hover:text-blue-500" // Adjust color as needed
                        >
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>

            {/* Mascot Image (Optional decoration) */}
            <img
                src={mascotImage}
                alt="Mascot"
                className="absolute bottom-0 right-0 h-40 md:h-60 w-auto z-0 pointer-events-none hidden lg:block" // Positioned bottom right, hidden on smaller screens
            />
        </div>
    );
}

export default Register;
