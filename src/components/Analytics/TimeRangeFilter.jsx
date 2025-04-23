// src/components/Analytics/TimeRangeFilter.jsx
import React from 'react';

// Example component - needs state and handler from parent to be functional
const TimeRangeFilter = ({ selectedRange = '7d', onChangeRange = () => {} }) => {
  const ranges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {ranges.map((range) => (
        <button
          key={range.key}
          onClick={() => onChangeRange(range.key)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-medium ${
            selectedRange === range.key
              ? 'bg-brand-medium text-white shadow-sm' // Active style
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' // Inactive style
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeFilter;
