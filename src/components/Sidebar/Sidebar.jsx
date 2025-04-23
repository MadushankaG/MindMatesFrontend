// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

// 1. Import the logo SVG file
//    Adjust the relative path if necessary based on your actual folder structure.
//    This path assumes Sidebar.jsx is in src/components/Sidebar/
//    and the logo is in src/assets/images/
import logoSrc from '../../assets/images/login.svg';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Study Rooms', path: '/study-rooms' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  const handleSignOut = () => {
    console.log('Signing out...');
    navigate('/login');
  };

  const baseLinkClass = "block rounded px-4 py-2.5 text-body-md font-sans transition-colors duration-150";
  const inactiveLinkClass = "text-sky-100 hover:bg-brand-medium hover:text-white";
  const activeLinkClass = "bg-brand-medium text-white font-semibold shadow-inner";

  return (
    <div className="flex w-60 flex-shrink-0 flex-col bg-brand-light text-white"> {/* Using custom color */}

      {/* Logo Section - Updated Structure */}
      <div className="flex h-auto flex-shrink-0 flex-col items-center justify-center p-6 border-b border-brand-medium"> {/* Use flex-col, adjust padding/height */}

        {/* 2. Add the img tag using the imported logo */}
        <img
          src={logoSrc} // Use the imported variable as the source
          alt="Mind Mates Logo"
          // 3. Adjust size using Tailwind width/height classes (e.g., w-16, h-16 or w-20, h-20)
          className="h-16 w-16 mb-3" // Added bottom margin
        />

        {/* 4. MIND MATES text below the logo */}
        <h1 className="text-xl font-heading font-bold text-white">
          MIND MATES
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col overflow-y-auto px-3">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-1.5">
              <NavLink
                to={item.path}
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

      {/* Sign Out Button */}
      <div className="flex-shrink-0 p-3 border-t border-brand-medium">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-start rounded px-4 py-2.5 text-body-md font-sans text-sky-100 transition-colors duration-150 hover:bg-brand-medium hover:text-white"
        >
          <FiLogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;