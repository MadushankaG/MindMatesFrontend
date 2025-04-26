// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import logoSrc from '../../assets/images/login.svg'; // Assuming logo path is correct
// Optional: Import js-cookie if you need to clear a refresh token cookie
// import Cookies from 'js-cookie';

const Sidebar = () => {
  const navigate = useNavigate();

  // Define navigation items for the sidebar
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Study Rooms', path: '/study-rooms' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Analytics', path: '/analytics' },
    //{ name: 'Settings', path: '/settings' },
  ];

  /**
   * Handles the sign-out process:
   * 1. Removes the authentication token from local storage.
   * 2. (Optional) Removes any refresh token from cookies.
   * 3. Navigates the user back to the login page.
   */
  const handleSignOut = () => {
    console.log('Signing out...');

    // 1. Remove the authentication token from localStorage
    localStorage.removeItem('token');

    // 2. Optional: Remove refresh token from cookies if you implemented it
    // Cookies.remove('refreshToken'); // Uncomment if using js-cookie and refresh tokens

    // 3. Navigate the user to the login page
    // The ProtectedRoute component will prevent access to protected pages now
    navigate('/login');
  };

  // CSS classes for navigation links
  const baseLinkClass = "block rounded px-4 py-2.5 text-body-md font-sans transition-colors duration-150";
  const inactiveLinkClass = "text-sky-100 hover:bg-brand-medium hover:text-white"; // Adjust colors as needed
  const activeLinkClass = "bg-brand-medium text-white font-semibold shadow-inner"; // Adjust colors as needed

  return (
      // Sidebar container styling (using example brand colors)
      <div className="flex w-60 flex-shrink-0 flex-col bg-brand-light text-white"> {/* Replace bg-brand-light */}

        {/* Logo Section */}
        <div className="flex h-auto flex-shrink-0 flex-col items-center justify-center p-6 border-b border-brand-medium"> {/* Replace border-brand-medium */}
          <img
              src={logoSrc}
              alt="Mind Mates Logo"
              className="h-16 w-16 mb-3" // Adjust size as needed
          />
          <h1 className="text-xl font-heading font-bold text-white">
            MIND MATES
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-1 flex-col overflow-y-auto px-3">
          <ul>
            {navItems.map((item) => (
                <li key={item.name} className="mb-1.5">
                  <NavLink
                      to={item.path}
                      // Apply active/inactive classes based on route match
                      className={({ isActive }) =>
                          `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                      }
                  >
                    {item.name}
                  </NavLink>
                </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out Button Section */}
        <div className="flex-shrink-0 p-3 border-t border-brand-medium"> {/* Replace border-brand-medium */}
          {/* Button triggers the handleSignOut function */}
          <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-start rounded px-4 py-2.5 text-body-md font-sans text-sky-100 transition-colors duration-150 hover:bg-brand-medium hover:text-white" // Adjust colors
          >
            <FiLogOut className="mr-3 h-5 w-5" /> {/* Logout Icon */}
            Sign Out
          </button>
        </div>
      </div>
  );
};

export default Sidebar;
