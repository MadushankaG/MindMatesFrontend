// src/pages/StudyRooms.jsx
import React, { useState, useEffect } from 'react';

import StudyRoomCard from '../components/StudyRooms/StudyRoomCard';
import RoomSearchFilter from '../components/StudyRooms/RoomSearchFilter';
import { getPublicStudyRooms } from '../api/apiStudyRooms';
import LoadingSpinner from '../components/smallComps/LoadingSpinner';

const StudyRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch rooms
    const fetchRooms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getPublicStudyRooms();
            // --- Add Detailed Logging Here ---
            console.log("[StudyRooms] Fetched raw response:", response);
            if (response && response.data && Array.isArray(response.data)) {
                console.log("[StudyRooms] Fetched rooms data:", response.data); // Log the array of rooms
                setRooms(response.data);
            } else {
                console.error("[StudyRooms] Invalid data format received from API:", response);
                setRooms([]);
                setError("Could not load rooms. Invalid data received.");
            }
            // --- End Logging ---
        } catch (err) {
            console.error("[StudyRooms] Failed to fetch study rooms:", err);
            setError("Failed to load study rooms. Please try again later.");
            setRooms([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchRooms();
    }, []);

    // Function to manually refresh rooms (can be passed down)
    const handleRoomCreated = () => {
        console.log("[StudyRooms] Refreshing room list after creation...");
        fetchRooms(); // Re-fetch the rooms list
    };


    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 p-6 lg:p-8 font-sans">

            {/* Left Column: Room Grid */}
            <div className="w-full md:w-2/3">
                <h2 className="text-h2 font-heading text-gray-800 mb-6">Browse All Study Rooms</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No public study rooms found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {rooms.map((room) => (
                            <StudyRoomCard
                                key={room.id || room.roomid} // Use a stable unique key
                                title={room.name}
                                description={room.description}
                                // Ensure you are passing the correct field name from your backend data
                                imageUrl={room.imageUrl} // Check if 'imageUrl' is the correct field name in the logged data
                                memberCount={room.participants ? room.participants.length : 0}
                                memberLimit={room.maxparticipants}
                                isPrivate={!room.ispublic}
                                roomId={room.roomid}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Search/Filter Sidebar */}
            <div className="w-full md:w-1/3">
                {/* Pass the refresh function to the filter component */}
                <RoomSearchFilter onRoomCreated={handleRoomCreated} />
            </div>

        </div>
    );
};

export default StudyRooms;
