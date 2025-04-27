import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // Using recharts for charts

// Import components
import StatCard from '../components/Analytics/StatCard';
import TimeRangeFilter from '../components/Analytics/TimeRangeFilter';
import LoadingSpinner from '../components/smallComps/LoadingSpinner'; // Optional loading indicator

// Import the API function
import { getAnalyticsData } from '../api/apiTracking'; // Ensure path is correct

// Helper function to format seconds into Hh Mm Ss format
const formatDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `; // Show minutes if hours > 0
    result += `${seconds}s`;
    return result.trim() || '0s'; // Handle case where duration is 0
};

// Helper function to format date strings for chart labels (e.g., "Apr 27")
const formatDateLabel = (dateString) => {
    try {
        const date = new Date(dateString);
        // Adjust options as needed
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString; // Fallback to original string if formatting fails
    }
};


const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d'); // Default time range
    const [stats, setStats] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when component mounts or timeRange changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setStats(null); // Clear previous data
            setDailyData([]);

            try {
                const response = await getAnalyticsData(timeRange);
                if (response && response.data) {
                    // Validate the structure slightly
                    if (response.data.stats && Array.isArray(response.data.dailyData)) {
                        setStats(response.data.stats);
                        // Process daily data for charts (format date, convert seconds to hours/minutes)
                        const processedDailyData = response.data.dailyData.map(day => ({
                            ...day,
                            name: formatDateLabel(day.date), // Formatted date for XAxis label
                            studyHours: day.studySeconds != null ? parseFloat((day.studySeconds / 3600).toFixed(1)) : 0, // Convert seconds to hours (1 decimal place)
                            // uniqueCategories field is assumed to be directly usable
                        }));
                        setDailyData(processedDailyData);
                    } else {
                        throw new Error("Invalid data structure received from analytics API.");
                    }
                } else {
                    throw new Error("No data received from analytics API.");
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                setError(err.message || "Failed to load analytics data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [timeRange]); // Re-run effect when timeRange changes

    // Handler for the TimeRangeFilter component
    const handleTimeRangeChange = (newRange) => {
        setTimeRange(newRange);
    };

    // --- Render Logic ---

    // Display loading state
    if (isLoading) {
        return (
            <div className="flex-1 bg-gray-100 p-6 lg:p-8 flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="flex-1 bg-gray-100 p-6 lg:p-8">
                <h2 className="text-h2 font-heading text-gray-800 mb-6">Analytics Dashboard</h2>
                <TimeRangeFilter selectedRange={timeRange} onChangeRange={handleTimeRangeChange} />
                <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">{error}</div>
            </div>
        );
    }

    // Display main content when data is loaded
    return (
        <div className="flex-1 bg-gray-100 p-6 lg:p-8 font-sans text-gray-900">
            {/* Page Title */}
            <h2 className="text-h2 font-heading text-gray-800 mb-6">Analytics Dashboard</h2>

            {/* Time Range Filter */}
            <TimeRangeFilter selectedRange={timeRange} onChangeRange={handleTimeRangeChange} />

            {/* Stats Cards Section */}
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Display stats using StatCard component */}
                    <StatCard
                        title="Total Study Time"
                        value={formatDuration(stats?.totalStudySeconds)} // Format seconds
                        unit="" // Unit is included in formatted value
                        iconName="clock" // Example icon
                    />
                    <StatCard
                        title="Avg. Session Duration"
                        value={formatDuration(stats?.averageSessionSeconds)} // Format seconds
                        unit=""
                        iconName="trend" // Example icon
                    />
                    <StatCard
                        title="Unique Categories"
                        value={stats?.uniqueCategoriesJoined ?? 'N/A'} // Handle null/undefined
                        unit="Joined"
                        iconName="tag" // Example icon (use appropriate one)
                    />
                    <StatCard
                        title="Total Sessions"
                        value={stats?.totalSessions ?? 'N/A'} // Handle null/undefined
                        unit="Completed"
                        iconName="check" // Example icon (use appropriate one)
                    />
                </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Study Time Chart */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200 min-h-[350px]">
                    <h3 className="text-lg font-semibold font-heading text-gray-700 mb-4">Daily Study Time</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis unit="h" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={30}/>
                                <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                                <Line type="monotone" dataKey="studyHours" name="Hours Studied" stroke="#33658A" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Unique Categories Chart */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200 min-h-[350px]">
                    <h3 className="text-lg font-semibold font-heading text-gray-700 mb-4">Daily Unique Categories Joined</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={30}/>
                                <Tooltip formatter={(value) => [`${value} categories`, 'Unique Categories']} />
                                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                                <Line type="monotone" dataKey="uniqueCategories" name="Categories Joined" stroke="#86BBDB" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Analytics;
