// src/components/StudyRooms/StudyRoomCard.jsx
import React from 'react';
import { FiLock, FiUsers } from 'react-icons/fi';
import defaultRoomImage from '../../assets/images/StudyRoomDefault.png';

/**
 * Card component to display study room information.
 * @param {object} props - Component props.
 * @param {string} [props.imageUrl] - URL of the room's image banner.
 * @param {string} props.title - The name of the study room.
 * @param {string} props.description - A brief description of the room.
 * @param {number} props.memberCount - Current number of participants.
 * @param {number} props.memberLimit - Maximum number of participants.
 * @param {boolean} props.isPrivate - Whether the room requires a password.
 * @param {string} props.roomId - The unique ID of the room (for potential actions).
 */
const StudyRoomCard = ({
                         imageUrl,
                         title,
                         description,
                         memberCount = 0,
                         memberLimit = 0,
                         isPrivate = false,
                         roomId
                       }) => {

  // --- Add Logging Here ---
  console.log(`[StudyRoomCard] Rendering card for room "${title}". Received imageUrl prop:`, imageUrl);
  // --- End Logging ---

  // Handle potential image loading errors
  const handleImageError = (event) => {
    console.warn(`[StudyRoomCard] Failed to load image: ${imageUrl} for room "${title}". Using default.`);
    event.target.onerror = null; // Prevent infinite loop
    event.target.src = defaultRoomImage;
  };

  return (
      <div className="bg-brand-dark rounded-lg shadow-lg overflow-hidden flex flex-col text-white font-sans">
        {/* Image Banner */}
        <img
            className="w-full h-32 object-cover"
            // Use the provided imageUrl, or the default image if imageUrl is missing/falsy
            src={imageUrl || defaultRoomImage}
            alt={`${title} banner`}
            onError={handleImageError}
        />

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title and Meta Info */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-heading font-bold text-slate-100 mr-2">{title}</h3>
            <div className="flex items-center text-sm text-slate-400 flex-shrink-0">
              {isPrivate && <FiLock className="w-3 h-3 mr-1.5" title="Private Room"/>}
              <FiUsers className="w-3 h-3 mr-1" />
              <span>{`${memberCount}/${memberLimit}`}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-body-md text-slate-300 mb-4 flex-grow text-sm">
            {description}
          </p>

          {/* More Info Button (Functionality TBD) */}
          <button
              onClick={() => console.log(`More info clicked for room: ${roomId}`)} // Placeholder action
              className="mt-auto w-full rounded-md bg-brand-medium py-2 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-brand-dark"
          >
            More Info
          </button>
        </div>
      </div>
  );
};

export default StudyRoomCard;
