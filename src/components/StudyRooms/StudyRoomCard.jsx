// src/components/StudyRooms/StudyRoomCard.jsx
import React from 'react';
import { FiLock, FiUsers } from 'react-icons/fi'; // Import icons
// Import the default image (adjust path if your folder structure is different)
import defaultRoomImage from '../../assets/images/StudyRoomDefault.png';
import { Link } from 'react-router-dom'; // <-- Import Link from react-router-dom

/**
 * Card component to display study room information.
 * Includes a link to the room's detail page.
 * @param {object} props - Component props.
 * @param {string} [props.imageUrl] - URL of the room's image banner.
 * @param {string} props.title - The name of the study room.
 * @param {string} props.description - A brief description of the room.
 * @param {number} props.memberCount - Current number of participants.
 * @param {number} props.memberLimit - Maximum number of participants.
 * @param {boolean} props.isPrivate - Whether the room requires a password.
 * @param {string} props.roomId - The unique ID of the room (used for navigation).
 */
const StudyRoomCard = ({
                           imageUrl,
                           title,
                           description,
                           memberCount = 0,
                           memberLimit = 0,
                           isPrivate = false,
                           roomId // Expecting the unique room ID (e.g., 'physics-101', 'uuid-string')
                       }) => {

    // Log received props (optional debugging)
    // console.log(`[StudyRoomCard] Rendering card for room "${title}". Received roomId:`, roomId);

    /**
     * Handles image loading errors by replacing the source with the default image.
     * @param {React.SyntheticEvent<HTMLImageElement, Event>} event - The error event.
     */
    const handleImageError = (event) => {
        console.warn(`[StudyRoomCard] Failed to load image: ${imageUrl} for room "${title}". Using default.`);
        event.target.onerror = null; // Prevent potential infinite loop if the default image also fails
        event.target.src = defaultRoomImage;
    };

    // Construct the URL path for the detail page using the roomId
    const detailPageUrl = `/study-rooms/${roomId}`;

    return (
        // Main card container with styling
        <div className="bg-brand-dark rounded-lg shadow-lg overflow-hidden flex flex-col text-white font-sans"> {/* Adjust bg-brand-dark */}

            {/* Image Banner section */}
            <img
                className="w-full h-32 object-cover" // Fixed height, object-cover maintains aspect ratio
                // Use the imageUrl from props if available, otherwise use the imported default image
                src={imageUrl || defaultRoomImage}
                alt={`${title} banner`}
                onError={handleImageError} // Attach the error handler
            />

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow"> {/* Padding and flex settings */}

                {/* Header section: Title and Meta Info */}
                <div className="flex justify-between items-start mb-1">
                    {/* Room Title */}
                    <h3 className="text-lg font-heading font-bold text-slate-100 mr-2">{title}</h3>
                    {/* Meta Info: Privacy Icon and Participant Count */}
                    <div className="flex items-center text-sm text-slate-400 flex-shrink-0">
                        {/* Show lock icon if the room is private */}
                        {isPrivate && <FiLock className="w-3 h-3 mr-1.5" title="Private Room"/>}
                        {/* Participant count */}
                        <FiUsers className="w-3 h-3 mr-1" />
                        <span>{`${memberCount}/${memberLimit}`}</span>
                    </div>
                </div>

                {/* Room Description */}
                <p className="text-body-md text-slate-300 mb-4 flex-grow text-sm"> {/* Styling for description */}
                    {description || "No description available."} {/* Fallback text */}
                </p>

                {/* Link acting as the "More Info" button */}
                <Link
                    to={detailPageUrl} // Set the destination URL for the link
                    // Apply button-like styling to the Link component
                    className="mt-auto block text-center w-full rounded-md bg-brand-medium py-2 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-brand-dark" // Adjust bg-brand-medium, focus colors etc.
                >
                    More Info
                </Link>

            </div> {/* End Content Area */}
        </div> // End Card container
    );
};

export default StudyRoomCard;
