// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';

import SummaryCard from '../components/Dashboard/SummaryCard';
import StudyChart from '../components/Dashboard/StudyChart';
import CreateRoomCard from '../components/Dashboard/CreateRoomCard';
import JoinRoomCard from '../components/Dashboard/JoinRoomCard';

// Simulation of data fetching (keep as is for now)
const fetchChartData = async () => { /* ... */ };

const Dashboard = () => {
    // Log when the Dashboard page mounts
    useEffect(() => {
        console.log("[Dashboard Page] Component Mounted");
    }, []);


    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        // Simulating fetch...
        setTimeout(() => {
            // Replace with actual fetchChartData() later
            const sampleData = [
                { name: 'Mon', hoursThisWeek: 4, hoursLastWeek: 3, subjectsThisWeek: 2, subjectsLastWeek: 3 },
                // ... other sample data points
            ];
            setChartData(sampleData);
            setIsLoading(false);
            console.log("[Dashboard Page] Simulated data fetched.");
        }, 500);

    }, []);

    const username = "Username"; // Replace with dynamic data later
    const summary = { hours: 12.3, subjects: 4, badges: 1 }; // Replace with dynamic data later

    console.log("[Dashboard Page] Rendering..."); // Log on every render

    return (
        <div className="flex-1 bg-slate-800 p-6 text-white overflow-y-auto">
            {/* Welcome Header */}
            <h2 className="mb-6 text-2xl font-semibold">Welcome, {username}</h2>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <SummaryCard value={summary.hours} unit="hours" description="studied this week" />
                <SummaryCard value={summary.subjects} unit="subjects" description="covered this week" />
                <SummaryCard value={summary.badges} unit="badge" description="earned this week" />
            </div>

            {/* Charts Section */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {isLoading ? (
                    <div className="text-center p-10 col-span-1 md:col-span-2">Loading charts...</div>
                ) : error ? (
                    <div className="text-center p-10 col-span-1 md:col-span-2 text-red-400">{error}</div>
                ) : (
                    <>
                        <StudyChart
                            title="Hours Studied"
                            data={chartData}
                            line1Key="hoursThisWeek"
                            line2Key="hoursLastWeek"
                            line1Name="This Week"
                            line2Name="Last Week"
                        />
                        <StudyChart
                            title="Subjects Covered"
                            data={chartData}
                            line1Key="subjectsThisWeek"
                            line2Key="subjectsLastWeek"
                            line1Name="This Week"
                            line2Name="Last Week"
                        />
                    </>
                )}
            </div>

            {/* Action Cards Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CreateRoomCard />
                <JoinRoomCard />
            </div>
        </div>
    );
};

export default Dashboard;
