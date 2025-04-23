// src/components/StudyRooms/StudyRoomCard.jsx
import React from 'react';
import { FiLock, FiUsers } from 'react-icons/fi'; // Import icons

// Example component, adjust props as needed for your actual data
const StudyRoomCard = ({
  imageUrl,
  title,
  description,
  memberCount = 0,
  memberLimit = 0,
  isPrivate = false,
}) => {
  return (
    // Card container using custom dark color
    <div className="bg-brand-dark rounded-lg shadow-lg overflow-hidden flex flex-col text-white font-sans">
      {/* Image Banner */}
      {/* You might want a placeholder if imageUrl is missing */}
      <img
        // Use aspect-video or a fixed height depending on design needs
        className="w-full h-32 object-cover"
        src={imageUrl || 'https://via.placeholder.com/400x150/2F4858/FFFFFF?text=No+Image'} // Placeholder image URL
        alt={`${title} banner`}
      />

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title and Meta Info */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-heading font-bold text-slate-100 mr-2">{title}</h3> {/* Use heading font, slightly smaller than h3 */}
          <div className="flex items-center text-sm text-slate-400 flex-shrink-0">
            {isPrivate && <FiLock className="w-3 h-3 mr-1.5" title="Private Room"/>}
            <FiUsers className="w-3 h-3 mr-1" />
            <span>{`${memberCount}/${memberLimit}`}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-body-md text-slate-300 mb-4 flex-grow text-sm"> {/* Use body font, adjusted size/color */}
          {description}
        </p>

        {/* More Info Button */}
        <button
          className="mt-auto w-full rounded-md bg-brand-medium py-2 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-brand-dark"
        >
          More Info
        </button>
      </div>
    </div>
  );
};

export default StudyRoomCard; // Make sure to export default