// src/api/apiStudyRooms.js
import api from "./index.js"
import {getCurrentUserId} from "./apiTracking.js";

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

export const getStudyRoomDetails = async (roomId) => {
    // Assume the endpoint uses the roomid provided in the path
    const endpoint = `/api/study-rooms/${roomId}`;
    if (!roomId) {
        console.error("getStudyRoomDetails: roomId is required.");
        throw new Error("Room ID is required."); // Or return a specific error response
    }
    try {
        console.log(`Fetching details for room: ${roomId}`);
        const response = await api.get(endpoint);
        return response; // Expect response.data to contain the StudyRoom object
    } catch (error) {
        console.error(`Error fetching details for room ${roomId}:`, error.response || error.message);
        throw error; // Re-throw for the component to handle
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


export const searchPublicRooms = async (searchTerm, categories) => {
    const endpoint = '/api/study-rooms/search';
    const params = {};
    if (searchTerm && searchTerm.trim() !== '') {
        params.searchTerm = searchTerm;
    }
    // Only add categories if the array is not empty
    if (categories && categories.length > 0) {
        params.categories = categories;
    }

    try {
        console.log("Calling searchPublicRooms with params object:", params);

        const response = await api.get(endpoint, {
            params,
            // --- Add paramsSerializer ---
            paramsSerializer: params => {
                // Use URLSearchParams to format the query string
                // This handles arrays by repeating the key (e.g., categories=A&categories=B)
                const searchParams = new URLSearchParams();
                for (const key in params) {
                    if (Object.prototype.hasOwnProperty.call(params, key)) {
                        const value = params[key];
                        if (Array.isArray(value)) {
                            // If it's an array, append each value separately
                            value.forEach(item => searchParams.append(key, item));
                        } else if (value !== null && value !== undefined) {
                            // Otherwise, append the single value
                            searchParams.append(key, value);
                        }
                    }
                }
                const queryString = searchParams.toString();
                console.log("Serialized Query String:", queryString); // Log the final string
                return queryString;
            }
            // --- End paramsSerializer ---
        });
        return response;
    } catch (error) {
        console.error("Error searching study rooms:", error.response || error.message);
        throw error;
    }
};


export const joinStudyRoom = async (roomId, password) => { // Removed unused currentUserId param from signature
    const currentUserId = getCurrentUserId(); // Get user ID from token

    if (!currentUserId) {
        // Throw an error that the component's catch block can handle
        throw new Error("Cannot join room: User not logged in or token invalid.");
    }
    if (!roomId) {
        // Throw an error that the component's catch block can handle
        throw new Error("Cannot join room: Room ID is required.");
    }

    const endpoint = '/api/study-rooms/join-room';
    const params = {
        roomId: roomId,
        currentUserId: currentUserId // Send the actual user ID
    };
    // Only include the password parameter if it's provided and not empty/whitespace
    if (password && String(password).trim() !== '') {
        params.password = password;
    }

    try {
        console.log("Calling joinStudyRoom API with params:", params);
        // Send null as body for POST, params go in the config object
        const response = await api.post(endpoint, null, { params });
        console.log("joinStudyRoom API response:", response);
        return response; // Expect room data on success
    } catch (error) {
        // Log the detailed error and re-throw it for the calling component
        console.error("Error joining study room API:", error.response || error.message);
        throw error;
    }
};
