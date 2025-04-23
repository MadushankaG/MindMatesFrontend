// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
// Ensure these paths are correct
import StatCard from '../components/Analytics/StatCard';
import TimeRangeFilter from '../components/Analytics/TimeRangeFilter';
// Import Recharts components
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector
} from 'recharts';

// --- Sample Data (Replace with fetched data) ---
const sampleLineData = [
  { name: 'Day 1', hours: 1.5 }, { name: 'Day 2', hours: 2 }, { name: 'Day 3', hours: 1 },
  { name: 'Day 4', hours: 3 }, { name: 'Day 5', hours: 2.5 }, { name: 'Day 6', hours: 4 },
  { name: 'Day 7', hours: 3.2 },
];

const samplePieData = [
  { name: 'Physics', value: 400 }, { name: 'History', value: 300 },
  { name: 'Software Eng.', value: 300 }, { name: 'Biology', value: 200 },
];

const PIE_COLORS = ['#33658A', '#86BBDB', '#2F4858', '#557C93']; // Use brand colors + shades

// Sample stats
const sampleStats = {
  totalHours: 17.2,
  avgSession: 1.8,
  streak: 7,
};
// --- End Sample Data ---

// Helper for custom active shape in Pie chart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  // (Keep renderActiveShape function as is)
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} Hrs`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">{`(Rate ${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};


const Analytics = () => {
  // State for time range, data, loading, error
  const [timeRange, setTimeRange] = useState('7d'); // Default to '7d'
  const [stats, setStats] = useState(sampleStats); // Initialize with sample data
  const [lineData, setLineData] = useState(sampleLineData); // Initialize with sample data
  const [pieData, setPieData] = useState(samplePieData); // Initialize with sample data
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Start with false if using sample data initially
  const [error, setError] = useState(null);

  // useEffect to fetch data when timeRange changes
  useEffect(() => {
    console.log("Effect triggered: Fetching data for time range:", timeRange);

    // Set loading state and clear previous errors
    setIsLoading(true);
    setError(null);

    // --- Placeholder for actual API call ---
    // Replace '/api/analytics' with your actual endpoint
    // Add authentication headers if needed
    fetch(`/api/analytics?range=${timeRange}`)
      .then(res => {
        if (!res.ok) {
          // Throw an error if response is not successful (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched data:", data);
        // ---- IMPORTANT ----
        // ** Update state with REAL data from your API response **
        // The structure below assumes your API returns an object like:
        // { stats: { totalHours: ..., avgSession: ..., streak: ... }, lineData: [...], pieData: [...] }
        // Adjust these lines based on your actual API response structure!
        // setStats(data.stats || sampleStats); // Use fetched or fallback to sample
        // setLineData(data.lineData || sampleLineData);
        // setPieData(data.pieData || samplePieData);

        // For now, we just log and keep sample data after a delay
        setTimeout(() => { // Simulate network delay
             console.log("Simulated fetch complete, keeping sample data for now.");
             // If you had real data, you'd update state here, e.g.:
             // setStats(data.stats);
             // setLineData(data.lineData);
             // setPieData(data.pieData);
             setIsLoading(false); // Stop loading AFTER data is processed
        }, 1000); // Simulate 1 second delay

      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
        // Keep existing sample data or clear it on error? Your choice.
        // setStats(sampleStats); // Optionally reset to sample on error
        // setLineData(sampleLineData);
        // setPieData(samplePieData);
        setIsLoading(false); // Stop loading on error
      });
      // Note: The .finally(() => setIsLoading(false)) block was removed
      // because loading should only stop *after* data is processed or an error occurs.

  }, [timeRange]); // Dependency array: Re-run this effect when timeRange changes

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Handler function passed to TimeRangeFilter
  const handleTimeRangeChange = (newRange) => {
    console.log("Time range changed to:", newRange);
    setTimeRange(newRange); // Update state, which triggers the useEffect
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 lg:p-8 font-sans text-gray-900">
      {/* Page Title */}
      <h2 className="text-h2 font-heading text-gray-800 mb-6">Analytics Dashboard</h2>

      {/* Time Range Filter - Pass the handler function */}
      <TimeRangeFilter selectedRange={timeRange} onChangeRange={handleTimeRangeChange} />

      {/* Loading / Error State */}
      {isLoading && <div className="text-center p-10 text-gray-500">Loading analytics for '{timeRange}'...</div>}
      {error && <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">{error}</div>}

      {/* Main Content Area */}
      {!isLoading && !error && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <section>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Display stats from state */}
                <StatCard title="Total Study Time" value={stats.totalHours} unit="Hrs" iconName="clock"/>
                <StatCard title="Avg. Session" value={stats.avgSession} unit="Hrs" iconName="trend"/>
                <StatCard title="Longest Streak" value={stats.streak} unit="Days" iconName="streak"/>
             </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Study Time Trend */}
            <div className="bg-white rounded-lg shadow p-5 border border-gray-200 min-h-[350px]"> {/* Added min-height */}
              <h3 className="text-lg font-semibold font-heading text-gray-700 mb-4">Study Time Trend ({timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'All Time'})</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {/* Display lineData from state */}
                  <LineChart data={lineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis unit="h" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={30}/>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}/>
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="hours" name="Hours Studied" stroke="#33658A" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="bg-white rounded-lg shadow p-5 border border-gray-200 min-h-[350px]"> {/* Added min-height */}
              <h3 className="text-lg font-semibold font-heading text-gray-700 mb-4">Subject Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                   {/* Display pieData from state */}
                   <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={pieData}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                        fill="#8884d8" dataKey="value" onMouseEnter={onPieEnter}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
          {/* Add more sections/charts as needed */}
        </div>
      )}
    </div>
  );
};

export default Analytics;

