// src/pages/StudyRooms.jsx
import React, { useState, useEffect } from 'react';

// Import the component for displaying each room card
import StudyRoomCard from '../components/StudyRooms/StudyRoomCard';
// Import the component for search/filter/create/join actions
import RoomSearchFilter from '../components/StudyRooms/RoomSearchFilter';
// Import the new API function
import { getPublicStudyRooms } from '../api/apiStudyRooms';
// Import a loading indicator (optional, replace with your preferred one)
import LoadingSpinner from '../components/smallComps/LoadingSpinner'; // Assuming you have this

const StudyRooms = () => {
    // State for storing the list of rooms fetched from the API
    const [rooms, setRooms] = useState([]);
    // State to track loading status
    const [isLoading, setIsLoading] = useState(true);
    // State to store any error messages during fetch
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true); // Set loading true before fetching
            setError(null); // Clear previous errors
            try {
                const response = await getPublicStudyRooms();
                // Assuming the API returns the array of rooms in response.data
                if (response && response.data && Array.isArray(response.data)) {
                    setRooms(response.data);
                } else {
                    console.error("Invalid data format received from API:", response);
                    setRooms([]); // Set to empty array on invalid data
                    setError("Could not load rooms. Invalid data received.");
                }
            } catch (err) {
                console.error("Failed to fetch study rooms:", err);
                setError("Failed to load study rooms. Please try again later.");
                setRooms([]); // Clear rooms on error
            } finally {
                setIsLoading(false); // Set loading false after fetch attempt (success or fail)
            }
        };

        fetchRooms(); // Call the fetch function
    }, []); // Empty dependency array means this runs only once on mount

    return (
        // Main container - sets up flex row layout on medium screens and up
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 p-6 lg:p-8 font-sans">

            {/* Left Column: Room Grid */}
            <div className="w-full md:w-2/3">
                <h2 className="text-h2 font-heading text-gray-800 mb-6">Browse All Study Rooms</h2>

                {/* Conditional Rendering based on loading and error states */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner /> {/* Display loading indicator */}
                    </div>
                ) : error ? (
                    <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">
                        <p>{error}</p> {/* Display error message */}
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No public study rooms found.</p> {/* Message when no rooms are available */}
                    </div>
                ) : (
                    // Display the grid of rooms if loading is complete, no error, and rooms exist
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {rooms.map((room) => (
                            // Map over the fetched rooms data
                            <StudyRoomCard
                                // Use a unique key, preferably room.id or room.roomid from the API data
                                key={room.id || room.roomid}
                                // Pass data from the fetched room object to the card props
                                title={room.name} // Assuming API returns 'name'
                                description={room.description} // Assuming API returns 'description'
                                // --- Placeholder/Assumed Props ---
                                // The API doc doesn't explicitly list these for get-public-rooms.
                                // Adjust these based on the actual API response or use defaults.
                                imageUrl={room.imageUrl || 'https://via.placeholder.com/400x150/2F4858/FFFFFF?text=Room+Image'} // Use placeholder if missing
                                memberCount={room.participants ? room.participants.length : 0} // Calculate from participants array if present
                                memberLimit={room.maxparticipants} // Assuming API returns 'maxparticipants'
                                isPrivate={!room.ispublic} // Derive from 'ispublic' field
                                // Pass other relevant props if needed (e.g., roomId for joining)
                                roomId={room.roomid} // Pass roomid for potential join actions
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Search/Filter Sidebar */}
            {/* This component might need its own state/API calls later for create/join */}
            <div className="w-full md:w-1/3">
                <RoomSearchFilter />
            </div>

        </div>
    );
};

export default StudyRooms;
