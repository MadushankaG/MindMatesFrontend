import Cookies from "js-cookie";
import api from "./index.js";

export const userLogin = async (username, password) => {
    // Use the correct endpoint from the documentation: POST /api/users/login
    const endpoint = '/api/users/login';

    // Send username and password as query parameters
    const response = await api.post(endpoint, null, { // Send null as body for POST
        params: {
            username: username, // Use the first argument as username
            password: password
        }
    });

    // --- Token Handling (Keep for now, but might need adjustment) ---
    // The original code handled tokens, possibly from a different endpoint (/auth/login).
    // If *this* endpoint (/api/users/login) *also* returns tokens, this code is fine.
    // If not, you might need to remove or adjust this based on the actual response.
    if (response.data && response.data.id && response.data.token) { // Example: Check if token exists
        console.log("Login successful, storing token." , response.data.token);
        localStorage.setItem("token", response.data.token);
        if (response.data.refreshToken) {
            // Consider security implications of storing refresh tokens in cookies
            Cookies.set("refreshToken", response.data.refreshToken, { expires: 1 });
        }
    } else if (response.data && response.data.id) {
        // Handle successful login based on docs (returns user object) but maybe no token?
        console.log("Login successful (no token in response based on current handling).");
        // If tokens are handled separately (e.g., via cookies set by server),
        // this might be sufficient.
    }
    // --- End Token Handling ---

    // Return the full response object
    return response;
};

/**
 * Registers a new user.
 * Sends required fields (username, email, password) and optional fields based on API documentation.
 * @param {object} values - An object containing user registration data.
 * @param {string} values.username - The chosen username (required).
 * @param {string} values.email - The user's email (required).
 * @param {string} values.password - The chosen password (required).
 * @param {string} [values.name] - The user's full name (optional).
 * @param {string} [values.profilepicurl] - URL to the profile picture (optional).
 * @param {string} [values.bio] - User's biography (optional).
 * @returns {Promise<object>} - The API response object.
 */
export const userRegister = async (values) => {
    // Use the correct endpoint from the documentation: POST /api/users/register
    const endpoint = '/api/users/register';

    // Prepare the request body according to the API documentation
    const requestBody = {
        username: values.username, // Required
        email: values.email,       // Required
        password: values.password, // Required
        // Include optional fields only if they are provided in the 'values' object
        ...(values.name && { name: values.name }),
        ...(values.profilepicurl && { profilepicurl: values.profilepicurl }),
        ...(values.bio && { bio: values.bio }),
    };

    // Make the POST request using the configured axios instance
    const response = await api.post(endpoint, requestBody);

    // Return the full response object (contains the created user data on success)
    return response;
};