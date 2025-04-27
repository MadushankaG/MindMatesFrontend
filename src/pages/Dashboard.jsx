import React, { useState, useEffect } from 'react';
// --- Corrected JWT Import ---
import jwtDecode from 'jwt-decode'; // Use default import
// --- End Correction ---

// Import API functions
import { getAnalyticsData } from '../api/apiTracking'; // For stats and chart data
import { getUserAchievements } from '../api/apiAchievements'; // For badge count

// Import Components
import SummaryCard from '../components/Dashboard/SummaryCard';
import StudyChart from '../components/Dashboard/StudyChart';
import CreateRoomCard from '../components/Dashboard/CreateRoomCard';
import JoinRoomCard from '../components/Dashboard/JoinRoomCard';
import LoadingSpinner from '../components/smallComps/LoadingSpinner'; // Optional

// Helper function to format seconds into Hh Mm Ss format
const formatDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // Optional: Add seconds display if needed
    // const seconds = totalSeconds % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    result += `${minutes}m`; // Always show minutes
    return result.trim() || '0m'; // Fallback to 0m
};

// Helper function to format date strings for chart labels (e.g., "Apr 27")
const formatDateLabel = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

const Dashboard = () => {
    // State for fetched data
    const [username, setUsername] = useState('');
    const [summaryStats, setSummaryStats] = useState({ hours: 0, subjects: 0, badges: 0 });
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all necessary data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            // 1. Get Username from Token
            let currentUsername = '';
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Use the default import here
                    const decoded = jwtDecode(token);
                    // IMPORTANT: Adjust 'username' if your JWT claim is different
                    currentUsername = decoded.username || 'User';
                    setUsername(currentUsername);
                } catch (e) {
                    console.error("Failed to decode token:", e);
                    setError("Could not identify user.");
                    setIsLoading(false);
                    return; // Stop fetching if user can't be identified
                }
            } else {
                setError("Not logged in."); // Should ideally be caught by ProtectedRoute
                setIsLoading(false);
                return;
            }


            // 2. Fetch Analytics and Achievements data in parallel
            try {
                const [analyticsRes, achievementsRes] = await Promise.all([
                    getAnalyticsData('7d'), // Fetch 7-day analytics
                    getUserAchievements()    // Fetch earned achievements list
                ]);

                // Process Analytics Data
                let fetchedHours = 0;
                let fetchedSubjects = 0;
                let processedChartData = [];

                if (analyticsRes?.data?.stats) {
                    fetchedHours = analyticsRes.data.stats.totalStudySeconds || 0;
                    fetchedSubjects = analyticsRes.data.stats.uniqueCategoriesJoined || 0;
                }
                if (analyticsRes?.data?.dailyData && Array.isArray(analyticsRes.data.dailyData)) {
                    processedChartData = analyticsRes.data.dailyData.map(day => ({
                        ...day,
                        name: formatDateLabel(day.date),
                        // Use 'studyHours' and 'uniqueCategories' as keys for the chart component
                        studyHours: day.studySeconds != null ? parseFloat((day.studySeconds / 3600).toFixed(1)) : 0,
                        subjectsCovered: day.uniqueCategories || 0 // Rename for clarity if needed by chart
                    }));
                    setChartData(processedChartData);
                }

                // Process Achievements Data
                let fetchedBadges = 0;
                if (achievementsRes?.data && Array.isArray(achievementsRes.data)) {
                    fetchedBadges = achievementsRes.data.length;
                }

                // Update Summary Stats State
                setSummaryStats({
                    hours: fetchedHours,
                    subjects: fetchedSubjects,
                    badges: fetchedBadges
                });

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError(err.message || "Could not load dashboard data.");
                // Keep potentially partial data or clear it? Clearing might be safer.
                setSummaryStats({ hours: 0, subjects: 0, badges: 0 });
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Run only on mount

    // --- Render Logic ---

    if (isLoading) {
        return <div className="flex-1 bg-slate-800 p-6 flex justify-center items-center"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="flex-1 bg-slate-800 p-6 text-center text-red-400">Error: {error}</div>;
    }

    return (
        <div className="flex-1 bg-slate-800 p-6 text-white overflow-y-auto">
            {/* Welcome Header */}
            <h2 className="mb-6 text-2xl font-semibold">Welcome, {username || 'User'}!</h2>

            {/* Summary Cards - Use fetched data */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <SummaryCard value={formatDuration(summaryStats.hours)} unit="" description="studied this week" />
                <SummaryCard value={summaryStats.subjects} unit="subjects" description="covered this week" />
                <SummaryCard value={summaryStats.badges} unit="badge(s)" description="earned so far" />
            </div>

            {/* Charts Section - Use fetched data */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Check if chartData has entries before rendering charts */}
                {chartData.length > 0 ? (
                    <>
                        <StudyChart
                            title="Hours Studied (Last 7 Days)"
                            data={chartData}
                            // Assuming StudyChart uses these keys based on previous examples
                            line1Key="studyHours"
                            // line2Key="hoursLastWeek" // Remove if only showing one line
                            line1Name="Hours"
                            // line2Name="Last Week"
                        />
                        <StudyChart
                            title="Subjects Covered (Last 7 Days)"
                            data={chartData}
                            // Assuming StudyChart uses these keys
                            line1Key="subjectsCovered" // Use the key from processed data
                            // line2Key="subjectsLastWeek" // Remove if only showing one line
                            line1Name="Subjects"
                            // line2Name="Last Week"
                        />
                    </>
                ) : (
                    <div className="text-center p-10 col-span-1 md:col-span-2 text-gray-400">No study data available for charts.</div>
                )}

            </div>

            {/* Action Cards Section (Remain static for now) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CreateRoomCard />
                <JoinRoomCard />
            </div>
        </div>
    );
};

export default Dashboard;
