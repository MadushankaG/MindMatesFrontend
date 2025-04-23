// src/pages/Register/Register.jsx (assuming this file location)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import images using relative paths from within src
import loginBackground from '../../assets/images/Background.png'; // Relative path for background
import logoSrc from '../../assets/images/logo.png';           // CORRECTED relative path for logo
import mascotImage from '../../assets/images/login.svg'; // Assuming the mascot is the SVG used before, adjust if needed

// 2. Import the userRegister function from your API file
// Make sure the path is correct relative to this Register.jsx file
import { userRegister } from '../../api/apiUser';

// Placeholder for a real notification function (replace with your actual implementation)
const showNotification = (type, title, description) => {
  console.log(`Notification (${type}): ${title} - ${description}`);
  // Replace alert with your actual notification call (e.g., Ant Design's notification.success or .error)
  alert(`${title}: ${description}`);
};

const Register = () => {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState(false);

    // State for form fields based on screenshot
    const [name, setName] = useState(''); // Combined Name field
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle Registration Submission
    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            showNotification('error', 'Registration Failed', 'Passwords do not match.');
            return;
        }
        setButtonState(true);
        try {
            // Prepare data for API - splitting 'name' crudely for example
            // Adjust this logic based on how you want to handle first/last name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || ''; // Handle names with multiple parts

            const values = {
                first_name: firstName,
                last_name: lastName,
                // Assuming API uses 'email' and 'password' directly from state
                email: email,
                password: password,
                // Add username if your API requires it for registration
                // username: username,
            };

            // Call the imported userRegister function
            await userRegister(values);

            showNotification('success', 'Registration Successful', 'Please log in.');
            navigate('/login'); // Redirect to login page after successful registration

        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred during registration.';
            showNotification('error', 'Registration Failed', errorMessage);
            setButtonState(false); // Reset button only on error
        }
        // No finally block, button remains disabled/in loading state until redirect or error shown
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
                src={logoSrc} // Use the imported logo source
                alt="Mind Mates Logo"
                className="h-16 md:h-20 w-auto mb-4 relative z-10" // Adjusted size and margin
            />

            {/* Registration Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8 relative z-10">
                <h1 className="text-xl md:text-2xl font-bold font-heading text-center text-gray-800 mb-6">
                    Welcome to Mind Mates
                </h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Combined Name & Username Row (Example layout) */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                             <input
                                type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Your Full Name"
                             />
                        </div>
                         <div className="flex-1">
                             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                             <input
                                type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Choose a Username"
                             />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                           type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                           type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           placeholder="Create a Password"
                        />
                    </div>

                    {/* Confirm Password */}
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
                        disabled={buttonState}
                         // Using generic blue, replace 'bg-blue-600' etc. with your 'bg-brand-medium' if defined in tailwind.config.js
                        className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white ${
                            buttonState
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {buttonState ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    {/* Login Link */}
                     <div className="text-sm text-center mt-4">
                        <Link
                            to="/login" // Link to the login page
                            className="font-medium text-blue-600 hover:text-blue-500" // Adjust color as needed
                        >
                           Already have an account?
                        </Link>
                    </div>
                </form>
            </div>

             {/* Mascot Image - Optional, positioned bottom right */}
            <img
                 src={mascotImage} // Assuming this is the owl mascot
                 alt="Mascot"
                 className="absolute bottom-0 right-0 h-40 md:h-60 w-auto z-0 pointer-events-none hidden lg:block" // Positioned bottom right, adjust size/visibility
            />
        </div>
    );
}

export default Register;