// src/components/StudyRooms/RoomSearchFilter.jsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
// Import the new modal component
import CreateRoomModal from './CreateRoomModal.jsx';
// Import the API function (assuming it's implemented in apiStudyRooms.js)
import { createStudyRoom } from '../../api/apiStudyRooms'; // Adjust path if needed

// --- Placeholder for User ID ---
// TODO: Replace this with a secure way to get the logged-in user's ID
// (e.g., from auth context, decoded token, global state)
const getCurrentUserId = () => {
    console.warn("Using placeholder user ID 'user123'. Replace with actual user ID from auth context.");
    return "user123"; // Placeholder
};
// --- End Placeholder ---

// --- Placeholder for Notification ---
// TODO: Replace with your actual notification system
const showNotification = (type, title, description) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    alert(`${title}: ${description}`);
};
// --- End Placeholder ---

// Example categories (can be shared or fetched)
const categories = [
    'Physics', 'History and Evolution', 'Software Engineering', 'Biology',
    'Databases and Data', 'Geography', 'Miscellaneous', 'Language Studies', 'Other'
];

const RoomSearchFilter = () => {
    // State for controlling the Create Room Modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State for tracking loading state during room creation
    const [isCreating, setIsCreating] = useState(false);

    // --- Handler Functions ---
    const handleJoinWithIdClick = () => {
        console.log('Join with ID button clicked');
        // TODO: Implement Join Room functionality (likely another modal)
        showNotification('info', 'Not Implemented', 'Join with ID functionality is not yet implemented.');
    };

    // Show the Create Room modal
    const handleCreateNewClick = () => {
        setIsModalOpen(true);
    };

    // Handle modal cancellation/closing
    const handleModalCancel = () => {
        if (!isCreating) { // Prevent closing while submitting
            setIsModalOpen(false);
        }
    };

    // Handle modal form submission (Create Room)
    const handleModalCreate = async (values) => {
        console.log('Received values from form: ', values);
        setIsCreating(true); // Set loading state

        // --- Get Creator ID (Placeholder) ---
        const creatorId = getCurrentUserId();
        if (!creatorId) {
            showNotification('error', 'Error', 'Could not identify current user. Please log in again.');
            setIsCreating(false);
            return;
        }
        // --- End Placeholder ---

        // Prepare data for the API call, adding the creatorId
        const roomData = {
            ...values, // Spread the form values (name, topic, category, etc.)
            creatorid: creatorId, // Add the creator ID
        };

        try {
            // Call the API function (ensure createStudyRoom is implemented in apiStudyRooms.js)
            const response = await createStudyRoom(roomData);
            console.log("Room created successfully:", response.data);
            showNotification('success', 'Room Created', `Room "${response.data.name}" created successfully!`);
            setIsModalOpen(false); // Close modal on success
            // TODO: Optionally refresh the room list or navigate to the new room
        } catch (error) {
            console.error('Failed to create room:', error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to create room.";
            showNotification('error', 'Creation Failed', errorMessage);
            // Keep modal open on error for user to correct or retry
        } finally {
            setIsCreating(false); // Reset loading state
        }
    };
    // --- End Handler Functions ---

    return (
        // Container styling
        <div className="bg-white rounded-lg shadow p-5 space-y-6 font-sans">

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleJoinWithIdClick}
                    className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white"
                >
                    Join with ID
                </button>
                <button
                    onClick={handleCreateNewClick} // Trigger the modal
                    className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white"
                >
                    Create New
                </button>
            </div>
            {/* End Action Buttons */}


            {/* Search Section */}
            <div>
                <h3 className="text-base font-semibold font-heading mb-3 text-gray-700">Search For Rooms</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search room name..."
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-brand-medium focus:outline-none focus:ring-1 focus:ring-brand-medium"
                    />
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            {/* End Search Section */}


            {/* Categories Section */}
            <div>
                <h3 className="text-base font-semibold font-heading mb-3 text-gray-700">Room Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-brand-medium shadow-sm focus:ring-brand-medium focus:ring-offset-white"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* End Categories Section */}

            {/* Render the Create Room Modal */}
            <CreateRoomModal
                open={isModalOpen}
                onCreate={handleModalCreate}
                onCancel={handleModalCancel}
                loading={isCreating}
            />

        </div> // End Container
    );
};

export default RoomSearchFilter;
