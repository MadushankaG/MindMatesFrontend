import api from "./index.js";
import jwtDecode from "jwt-decode";

const getCurrentUsername = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const username = decodedToken.username;
            if (!username) {
                console.error("Username claim not found in token.");
                return null;
            }
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                console.error("Token expired.");
                localStorage.removeItem('token');
                return null;
            }
            return username;
        } catch (error) {
            console.error("Failed to decode token:", error);
            localStorage.removeItem('token');
            return null;
        }
    }
    console.error("No token found for getting username.");
    return null;
};

export const checkUserAchievements = async () => {
    const username = getCurrentUsername();
    if (!username) {
        throw new Error("Cannot check achievements: User not found.");
    }

    const endpoint = `/api/achievements/check/${username}`;

    try {
        console.log(`Calling checkAchievements for user ${username}`);
        const response = await api.post(endpoint);
        return response;
    } catch (error) {
        console.error(`Error checking achievements for user ${username}:`, error.response || error.message);
        throw error;
    }
};

export const getUserAchievements = async () => {
    const username = getCurrentUsername();
    if (!username) {
        throw new Error("Cannot get achievements: User not found.");
    }
    const endpoint = `/api/achievements/user/${username}`;


    try {
        console.log(`Fetching all achievements for user ${username}`);
        const response = await api.get(endpoint);
        return response;
    } catch (error) {
        console.error(`Error fetching achievements for user ${username}:`, error.response || error.message);
        throw error;
    }
};


export const getDashboardStatsApi = async () => {
    const username = getCurrentUsername();
    if (!username) {
        throw new Error("Cannot get dashboard stats: User not found.");
    }
    const endpoint = `/api/achievements/stats/${username}`;
    try {
        console.log(`Fetching dashboard stats for user ${username}`);
        const response = await api.get(endpoint);
        return response;
    } catch (error) {
        console.error(`Error fetching dashboard stats for user ${username}:`, error.response || error.message);
        throw error;
    }
};

