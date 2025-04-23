// src/components/Dashboard/StudyChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define colors similar to the image
const COLOR_THIS_WEEK = "#38bdf8"; // Light Blue
const COLOR_LAST_WEEK = "#6366f1"; // Indigo/Darker Blue

const StudyChart = ({ title, data, line1Key, line2Key, line1Name, line2Name }) => {
  // Ensure data is an array before rendering
  if (!Array.isArray(data)) {
    console.warn("Chart data is not an array!", data);
    return <div className="text-white">Loading chart data or data error...</div>; // Or a loading spinner
  }

  return (
    <div className="flex-1 rounded-lg bg-slate-700 p-4 text-white shadow"> {/* Adjusted color */}
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div style={{ width: '100%', height: 250 }}> {/* Fixed height container for chart */}
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20, // Added right margin for labels
              left: -10, // Adjusted left margin for Y-axis labels
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> {/* Grid line color */}
            <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} fontSize={12} /> {/* X-axis label styling */}
            <YAxis tick={{ fill: '#cbd5e1' }} fontSize={12} /> {/* Y-axis label styling */}
            <Tooltip
               contentStyle={{ backgroundColor: '#334155', border: 'none', borderRadius: '4px' }} // Tooltip style
               itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} /> {/* Legend styling */}
            <Line
              type="monotone"
              dataKey={line1Key}
              name={line1Name}
              stroke={COLOR_THIS_WEEK}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={line2Key}
              name={line2Name}
              stroke={COLOR_LAST_WEEK}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudyChart;