// src/components/StudyRooms/RoomSearchFilter.jsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import CreateRoomModal from './CreateRoomModal';
import { createStudyRoom, uploadRoomImageApi } from '../../api/apiStudyRooms';

// --- Placeholder for User ID ---
const getCurrentUserId = () => {
    console.warn("Using placeholder user ID 'user123'. Replace with actual user ID from auth context.");
    return "user123";
};
// --- End Placeholder ---

// --- Placeholder for Notification ---
const showNotification = (type, title, description) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    alert(`${title}: ${description}`);
};
// --- End Placeholder ---

// Example categories
const categories = [
    'Physics', 'History and Evolution', 'Software Engineering', 'Biology',
    'Databases and Data', 'Geography', 'Miscellaneous', 'Language Studies', 'Other'
];

// Add onRoomCreated to props
const RoomSearchFilter = ({ onRoomCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // --- Handler Functions ---
    const handleJoinWithIdClick = () => {
        console.log('Join with ID button clicked');
        showNotification('info', 'Not Implemented', 'Join with ID functionality is not yet implemented.');
    };

    const handleCreateNewClick = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        if (!isCreating) {
            setIsModalOpen(false);
        }
    };

    // Handle modal form submission (Create Room)
    const handleModalCreate = async (formValues, selectedFile) => {
        console.log('[handleModalCreate] Triggered.');
        console.log('[handleModalCreate] Received formValues:', formValues);
        console.log('[handleModalCreate] Received selectedFile:', selectedFile);
        setIsCreating(true);
        let imageUrl = null; // Initialize imageUrl

        // 1. Handle Image Upload
        if (selectedFile) {
            console.log('[handleModalCreate] selectedFile is TRUTHY. Proceeding with upload.');
            try {
                const formData = new FormData();
                if (selectedFile instanceof File) {
                    formData.append('file', selectedFile);
                    console.log('[handleModalCreate] Appended file to FormData:', formData.get('file'));
                } else {
                    console.error('[handleModalCreate] selectedFile is not a File object:', selectedFile);
                    throw new Error("Invalid file selected.");
                }

                console.log("[handleModalCreate] Attempting to call uploadRoomImageApi...");
                const uploadResponse = await uploadRoomImageApi(formData);
                console.log("[handleModalCreate] uploadRoomImageApi call finished.");

                if (uploadResponse && uploadResponse.data && uploadResponse.data.imageUrl) {
                    imageUrl = uploadResponse.data.imageUrl; // Assign the URL
                    console.log("[handleModalCreate] Image uploaded successfully, URL:", imageUrl);
                } else {
                    console.error("[handleModalCreate] Image URL not found in upload response:", uploadResponse);
                    throw new Error("Image URL not found in upload response.");
                }
            } catch (uploadError) {
                console.error('[handleModalCreate] Image upload failed:', uploadError);
                showNotification('error', 'Upload Failed', `Could not upload room image: ${uploadError.message || 'Unknown error'}`);
                setIsCreating(false);
                return;
            }
        } else {
            console.log('[handleModalCreate] selectedFile is FALSY. Skipping upload.');
        }

        // --- 2. Prepare Room Data ---
        console.log('[handleModalCreate] Preparing room data...');
        const creatorId = getCurrentUserId();
        if (!creatorId) {
            showNotification('error', 'Error', 'Could not identify current user. Please log in again.');
            setIsCreating(false);
            return;
        }

        // --- Log imageUrl right before creating roomData ---
        console.log(`[handleModalCreate] Value of imageUrl before creating roomData: "${imageUrl}" (Type: ${typeof imageUrl})`);
        // --- End Log ---

        // Create the base roomData object
        const roomData = {
            ...formValues,
            creatorid: creatorId,
            // ispublic: formValues.ispublic, // Already included in formValues if handled correctly by modal
        };

        // Explicitly add imageUrl if it's a non-empty string
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            roomData.imageUrl = imageUrl;
            console.log('[handleModalCreate] Added imageUrl to roomData.');
        } else {
            console.log('[handleModalCreate] imageUrl was null or empty, not adding to roomData.');
        }


        // --- Log the final roomData object ---
        console.log("[handleModalCreate] Final roomData object being sent:", roomData);
        // --- End Log ---


        // --- 3. Create the Room ---
        try {
            console.log("[handleModalCreate] Attempting to call createStudyRoom...");
            const response = await createStudyRoom(roomData); // Send the final roomData
            console.log("[handleModalCreate] Room created successfully:", response.data);
            showNotification('success', 'Room Created', `Room "${response.data.name}" created successfully!`);
            setIsModalOpen(false);

            if (onRoomCreated && typeof onRoomCreated === 'function') {
                onRoomCreated();
            }

        } catch (error) {
            console.error('[handleModalCreate] Failed to create room:', error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to create room.";
            showNotification('error', 'Creation Failed', errorMessage);
        } finally {
            console.log('[handleModalCreate] Resetting isCreating state.');
            setIsCreating(false);
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
