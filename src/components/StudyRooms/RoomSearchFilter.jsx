import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import CreateRoomModal from './CreateRoomModal';
import { createStudyRoom, uploadRoomImageApi, searchPublicRooms } from '../../api/apiStudyRooms';
// Import the function to get the real user ID
import { getCurrentUserId } from '../../api/apiTracking'; // Assuming it's now in apiTracking.js
import { debounce } from 'lodash';

// Placeholder Notification
const showNotification = (type, title, description) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    alert(`${title}: ${description}`);
};

const categories = [
    'Physics', 'History and Evolution', 'Software Engineering', 'Biology',
    'Databases and Data', 'Geography', 'Miscellaneous', 'Language Studies', 'Other'
];

const RoomSearchFilter = ({ onRoomCreated, onSearchUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const debouncedSearch = useCallback(
        debounce(async (term, cats) => {
            if (!onSearchUpdate) return;
            onSearchUpdate('loading');
            try {
                const response = await searchPublicRooms(term, cats);
                onSearchUpdate('success', response.data || []);
            } catch (error) {
                console.error("Search failed:", error);
                onSearchUpdate('error', error);
            }
        }, 500),
        [onSearchUpdate]
    );

    useEffect(() => {
        debouncedSearch(searchTerm, selectedCategories);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, selectedCategories, debouncedSearch]);


    const handleJoinWithIdClick = () => { /* ... */ };
    const handleCreateNewClick = () => setIsModalOpen(true);
    const handleModalCancel = () => { if (!isCreating) setIsModalOpen(false); };

    // --- Updated handleModalCreate ---
    const handleModalCreate = async (formValues, selectedFile) => {
        console.log('[handleModalCreate] Triggered.');
        setIsCreating(true);
        let imageUrl = null;

        // 1. Handle Image Upload
        if (selectedFile) {
            try {
                const formData = new FormData();
                if (selectedFile instanceof File) {
                    formData.append('file', selectedFile);
                } else { throw new Error("Invalid file."); }
                const uploadResponse = await uploadRoomImageApi(formData);
                if (uploadResponse?.data?.imageUrl) {
                    imageUrl = uploadResponse.data.imageUrl;
                } else { throw new Error("URL missing in response."); }
            } catch (uploadError) {
                console.error('Upload failed:', uploadError);
                showNotification('error', 'Upload Failed', `Could not upload image: ${uploadError.message}`);
                setIsCreating(false); return;
            }
        }

        // --- 2. Get REAL Creator ID ---
        const creatorId = getCurrentUserId(); // Call the function to get ID from JWT
        if (!creatorId) {
            // Handle case where user ID couldn't be retrieved (e.g., token missing/invalid)
            showNotification('error', 'Error', 'Could not identify current user. Please log in again.');
            setIsCreating(false);
            return;
        }
        console.log(`[handleModalCreate] Using creatorId: ${creatorId}`); // Log the actual ID being used
        // --- End Get Creator ID ---

        // 3. Prepare Room Data with real creatorId
        const roomData = {
            ...formValues,
            creatorid: creatorId, // Use the actual ID
            ...(imageUrl && { imageUrl: imageUrl }),
        };

        // 4. Create the Room
        try {
            console.log("[handleModalCreate] Final roomData object being sent:", roomData);
            const response = await createStudyRoom(roomData);
            showNotification('success', 'Room Created', `Room "${response.data.name}" created.`);
            setIsModalOpen(false);
            if (onRoomCreated) onRoomCreated();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create room.";
            showNotification('error', 'Creation Failed', errorMessage);
        } finally {
            setIsCreating(false);
        }
    };
    // --- End Updated handleModalCreate ---

    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

    return (
        <div className="bg-white rounded-lg shadow p-5 space-y-6 font-sans">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={handleJoinWithIdClick} className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white">Join with ID</button>
                <button onClick={handleCreateNewClick} className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white">Create New</button>
            </div>

            {/* Search Section */}
            <div>
                <h3 className="text-base font-semibold font-heading mb-3 text-gray-700">Search For Rooms</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search room name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
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
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 rounded border-gray-300 text-brand-medium shadow-sm focus:ring-brand-medium focus:ring-offset-white"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Create Room Modal */}
            <CreateRoomModal
                open={isModalOpen}
                onCreate={handleModalCreate}
                onCancel={handleModalCancel}
                loading={isCreating}
            />
        </div>
    );
};

export default RoomSearchFilter;
