// src/api/apiStudyRooms.js
import api from "./index.js"

/**
 * Fetches the list of public study rooms from the backend.
 * Corresponds to GET /api/study-rooms/get-public-rooms
 * @returns {Promise<object>} - The API response object containing the list of public rooms in response.data.
 */
export const getPublicStudyRooms = async () => {
    const endpoint = '/api/study-rooms/get-public-rooms'; // Endpoint from documentation

    try {
        const response = await api.get(endpoint);
        // Assuming the backend returns the array of rooms directly in the data property
        return response;
    } catch (error) {
        console.error("Error fetching public study rooms:", error.response || error.message);
        // Re-throw the error so the component can handle it
        throw error;
    }
};

/**
 * Creates a new study room.
 * Corresponds to POST /api/study-rooms/create
 * TODO: Implement this function when Create Room functionality is needed.
 * TODO: Securely get creatorId from auth context instead of passing it.
 * @param {object} roomData - Data for the new room.
 * @returns {Promise<object>} - The API response object.
 */
export const createStudyRoom = async (roomData) => {
    const endpoint = '/api/study-rooms/create';
    console.log("Sending data to create room:", roomData); // Log data being sent

    // --- Security Warning ---
    // The 'creatorid' included in roomData should ideally be verified
    // on the backend against the authenticated user making the request.
    // Passing it directly from the client can be insecure if not validated server-side.
    // --- End Security Warning ---

    try {
        // Make the POST request with roomData in the request body
        const response = await api.post(endpoint, roomData);
        return response;
    } catch (error) {
        console.error("Error creating study room:", error.response?.data || error.message);
        // Re-throw the error for the component to handle
        throw error;
    }
};

export const uploadRoomImageApi = async (formData) => {
    const endpoint = '/api/files/upload/room-image';
    try {
        const response = await api.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
            },
        });

        console.log(response.data);

        return response;
    } catch (error) {
        console.error("Error uploading room image:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * Joins a study room.
 * Corresponds to POST /api/study-rooms/join-room
 * TODO: Implement this function when Join Room functionality is needed.
 * TODO: Securely get currentUserId from auth context instead of passing it.
 * @param {string} roomId - The ID of the room to join.
 * @param {string|null} password - The password if the room is private.
 * @param {string} currentUserId - The ID of the user joining (INSECURE - get from auth).
 * @returns {Promise<object>} - The API response object.
 */
export const joinStudyRoom = async (roomId, password, currentUserId) => {
    const endpoint = '/api/study-rooms/join-room';
    // Example implementation (needs actual data and error handling)
    // const response = await api.post(endpoint, null, { params: { roomId, password, currentUserId } });
    // return response;
    console.warn("joinStudyRoom function not fully implemented yet.");
    return Promise.reject("Not implemented"); // Placeholder
};

// Add other study room related API functions here (e.g., getRoomDetails, leaveRoom)
