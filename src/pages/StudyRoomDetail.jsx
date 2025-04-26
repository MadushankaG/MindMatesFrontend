// src/pages/StudyRoomDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams to get URL params and Link
import { getStudyRoomDetails } from '../api/apiStudyRooms'; // Import the API function
import LoadingSpinner from '../components/smallComps/LoadingSpinner'; // Optional loading indicator
import defaultRoomImage from '../assets/images/StudyRoomDefault.png'; // Default image
import { FiUsers, FiVideo, FiTag, FiInfo } from 'react-icons/fi'; // Icons

const StudyRoomDetail = () => {
    // Get the roomId from the URL parameters (defined in routes.jsx)
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch room details when the component mounts or roomId changes
    useEffect(() => {
        if (!roomId) {
            setError("No Room ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getStudyRoomDetails(roomId);
                if (response && response.data) {
                    setRoom(response.data);
                } else {
                    throw new Error("Room not found or invalid data received.");
                }
            } catch (err) {
                console.error(`Error fetching room details for ${roomId}:`, err);
                setError(err.response?.data?.message || err.message || "Failed to load room details.");
                setRoom(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [roomId]); // Re-run effect if roomId changes

    // Handle image loading errors
    const handleImageError = (event) => {
        event.target.onerror = null; // Prevent infinite loop
        event.target.src = defaultRoomImage;
    };

    // Display loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
                <h2 className="text-xl text-red-500 mb-4">Error Loading Room</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link to="/study-rooms" className="text-blue-600 hover:underline">
                    Back to Study Rooms
                </Link>
            </div>
        );
    }

    // Display message if room data couldn't be loaded
    if (!room) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
                <h2 className="text-xl text-gray-700 mb-4">Room Not Found</h2>
                <Link to="/study-rooms" className="text-blue-600 hover:underline">
                    Back to Study Rooms
                </Link>
            </div>
        );
    }

    // --- Render Room Details ---
    return (
        <div className="container mx-auto p-4 md:p-8 font-sans">
            {/* Back Link */}
            <div className="mb-6">
                <Link to="/study-rooms" className="text-blue-600 hover:text-blue-800 transition-colors duration-150 inline-flex items-center">
                    &larr; Back to Study Rooms
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Image Banner */}
                <img
                    src={room.imageUrl || defaultRoomImage}
                    alt={`${room.name} banner`}
                    className="w-full h-48 md:h-64 object-cover" // Adjust height as needed
                    onError={handleImageError}
                />

                <div className="p-6 md:p-8">
                    {/* Header: Title and Join Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-800 mb-2 sm:mb-0">
                            {room.name}
                        </h1>
                        {/* Conditionally render Join button if videoMeetingUrl exists */}
                        {room.videoMeetingUrl ? (
                            <a
                                href={room.videoMeetingUrl}
                                target="_blank" // Open in new tab
                                rel="noopener noreferrer" // Security best practice
                                className="bg-brand-medium hover:bg-opacity-80 text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors duration-150 inline-flex items-center" // Adjust colors
                            >
                                <FiVideo className="mr-2" /> Join Meeting
                            </a>
                        ) : (
                            <span className="text-gray-500 italic text-sm">Meeting link not available</span>
                        )}

                    </div>

                    {/* Meta Info: Category, Participants */}
                    <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-x-4 gap-y-1">
            <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
              <FiTag className="mr-1.5" /> Category: {room.category || 'N/A'}
            </span>
                        <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
              <FiUsers className="mr-1.5" /> Participants: {room.participants?.length || 0} / {room.maxparticipants || 'N/A'}
            </span>
                        <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
               <FiInfo className="mr-1.5" /> Status: {room.ispublic ? 'Public' : 'Private'}
            </span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold font-heading text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {room.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Participants List */}
                    <div>
                        <h2 className="text-lg font-semibold font-heading text-gray-700 mb-3">Participants ({room.participants?.length || 0})</h2>
                        {room.participants && room.participants.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {/* TODO: Fetch actual usernames/details based on IDs later */}
                                {room.participants.map((participantId) => (
                                    <li key={participantId}>User ID: {participantId}</li> // Displaying IDs for now
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No participants currently in the room.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudyRoomDetail;
