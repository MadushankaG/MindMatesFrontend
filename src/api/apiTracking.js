// src/api/apiTracking.js
import api from ".";
import jwtDecode from "jwt-decode";

/**
 * Decodes the JWT from localStorage.
 * @returns {object|null} The decoded payload or null if token is missing/invalid.
 */
const getDecodedToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // Optional: Check expiration
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                console.error("Token expired.");
                localStorage.removeItem('token');
                return null;
            }
            return decodedToken;
        } catch (error) {
            console.error("Failed to decode token:", error);
            localStorage.removeItem('token');
            return null;
        }
    }
    console.error("No token found in localStorage.");
    return null;
};

/**
 * Retrieves the current user's username from the JWT.
 * @returns {string|null} The username or null.
 */
export const getCurrentUsername = () => { // Added export
    const decodedToken = getDecodedToken();
    // IMPORTANT: Adjust 'username' if your JWT claim name is different
    const username = decodedToken?.username;
    if (!username) {
        console.error("Username claim ('username') not found in token payload.");
        return null;
    }
    return username;
};

/**
 * Retrieves the current user's ID from the JWT.
 * @returns {string|null} The user ID or null.
 */
export const getCurrentUserId = () => { // Added export
    const decodedToken = getDecodedToken();
    // IMPORTANT: Adjust 'userId' if your JWT claim name is different (e.g., 'id', 'sub')
    const userId = decodedToken?.userId;
    if (!userId) {
        console.error("User ID claim ('userId') not found in token payload.");
        return null;
    }
    return userId;
};


// --- startTracking, stopTracking, getAnalyticsData (use getCurrentUsername) ---

export const startTracking = async (roomId) => {
    const username = getCurrentUsername(); // Uses username
    if (!username || !roomId) {
        throw new Error("Username or Room ID missing for tracking.");
    }
    const endpoint = '/api/tracking/start';
    const payload = { username, roomId };
    try {
        const response = await api.post(endpoint, payload);
        return response;
    } catch (error) {
        console.error("Error starting tracking:", error.response || error.message);
        throw error;
    }
};

export const stopTracking = async (roomId) => {
    const username = getCurrentUsername(); // Uses username
    if (!username || !roomId) {
        console.error("stopTracking: Missing username or roomId.");
        return null;
    }
    const endpoint = '/api/tracking/stop';
    const payload = { username, roomId };
    try {
        const response = await api.post(endpoint, payload);
        return response;
    } catch (error) {
        console.error("Error stopping tracking:", error.response || error.message);
        return null;
    }
};

export const getAnalyticsData = async (range = '7d') => {
    const username = getCurrentUsername(); // Uses username
    if (!username) {
        throw new Error("Cannot fetch analytics data: User not found.");
    }
    const endpoint = `/api/tracking/user/${username}/analytics`;
    try {
        const response = await api.get(endpoint, { params: { range: range } });
        return response;
    } catch (error) {
        console.error(`Error fetching analytics data (range: ${range}):`, error.response || error.message);
        throw error;
    }
};
