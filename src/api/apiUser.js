import Cookies from "js-cookie";
import api from "./index.js";

export const userLogin = async (email, password) => {
    const response = await api.post(`/auth/login`, {
        email,
        password,
    });
    if (response.data.id) {
        localStorage.setItem("token", response.data.token);
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 1 });
    }
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