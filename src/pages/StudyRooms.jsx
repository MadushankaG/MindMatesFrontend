import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback

import StudyRoomCard from '../components/StudyRooms/StudyRoomCard';
import RoomSearchFilter from '../components/StudyRooms/RoomSearchFilter';
import LoadingSpinner from '../components/smallComps/LoadingSpinner';

const StudyRooms = () => {
    const [displayedRooms, setDisplayedRooms] = useState([]);
    // Separate state for loading triggered by search/filter
    const [isSearching, setIsSearching] = useState(true); // Start loading initially
    const [searchError, setSearchError] = useState(null);

    // Handler to receive updates from RoomSearchFilter
    const handleSearchUpdate = useCallback((status, data) => {
        console.log(`[StudyRooms] Search update received: Status=${status}`);
        switch (status) {
            case 'loading':
                setIsSearching(true);
                setSearchError(null);
                break;
            case 'error':
                setIsSearching(false);
                setSearchError("Failed to load rooms. Please try adjusting filters."); // Set error message
                setDisplayedRooms([]); // Clear rooms on error
                break;
            case 'success':
                setIsSearching(false);
                setSearchError(null);
                setDisplayedRooms(data || []); // Update displayed rooms with results
                break;
            default:
                setIsSearching(false);
                break;
        }
    }, []); 



    
    const handleRoomCreated = () => {
        console.log("[StudyRooms] Room created, triggering search update (implementation needed)");
    };


    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 p-6 lg:p-8 font-sans">

            {/* Left Column: Room Grid */}
            <div className="w-full md:w-2/3">
                <h2 className="text-h2 font-heading text-gray-800 mb-6">Browse Study Rooms</h2>

                {/* Display loading, error, or room cards based on search state */}
                {isSearching ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : searchError ? (
                    <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">
                        <p>{searchError}</p>
                    </div>
                ) : displayedRooms.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No study rooms found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Render rooms from the displayedRooms state */}
                        {displayedRooms.map((room) => (
                            <StudyRoomCard
                                key={room.id || room.roomid}
                                title={room.name}
                                description={room.description}
                                imageUrl={room.imageUrl}
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
                {/* Pass the handler down to receive search updates */}
                <RoomSearchFilter
                    onSearchUpdate={handleSearchUpdate}
                    onRoomCreated={handleRoomCreated} // Pass refresh handler
                />
            </div>

        </div>
    );
};

export default StudyRooms;
