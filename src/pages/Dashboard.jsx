// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';

// Ensure these paths are correct and these components export default
import SummaryCard from '../components/Dashboard/SummaryCard';
import StudyChart from '../components/Dashboard/StudyChart';
import CreateRoomCard from '../components/Dashboard/CreateRoomCard';
import JoinRoomCard from '../components/Dashboard/JoinRoomCard';

// Simulation of data fetching
const fetchChartData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { name: 'Mon', hoursThisWeek: 4, hoursLastWeek: 3, subjectsThisWeek: 2, subjectsLastWeek: 3 },
    { name: 'Tue', hoursThisWeek: 3, hoursLastWeek: 5, subjectsThisWeek: 3, subjectsLastWeek: 2 },
    { name: 'Wed', hoursThisWeek: 6, hoursLastWeek: 4, subjectsThisWeek: 4, subjectsLastWeek: 4 },
    { name: 'Thu', hoursThisWeek: 8, hoursLastWeek: 7, subjectsThisWeek: 5, subjectsLastWeek: 3 },
    { name: 'Fri', hoursThisWeek: 5, hoursLastWeek: 9, subjectsThisWeek: 3, subjectsLastWeek: 5 },
    { name: 'Sat', hoursThisWeek: 9, hoursLastWeek: 6, subjectsThisWeek: 6, subjectsLastWeek: 7 },
    { name: 'Sun', hoursThisWeek: 7, hoursLastWeek: 8, subjectsThisWeek: 5, subjectsLastWeek: 4 },
  ];
};

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchChartData()
      .then(data => {
        setChartData(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch chart data:", err);
        setError("Could not load chart data.");
        setChartData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const username = "Username"; // Replace with dynamic data later
  const summary = { hours: 12.3, subjects: 4, badges: 1 }; // Replace with dynamic data later

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

export default Dashboard; // Default export is correctly included