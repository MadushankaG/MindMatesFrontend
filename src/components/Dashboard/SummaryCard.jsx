// src/components/Dashboard/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ value, unit, description }) => {
  return (
    <div className="flex-1 rounded-lg bg-slate-700 p-4 text-white shadow"> {/* Adjusted color */}
      <div className="text-2xl font-bold">{value} <span className="text-lg font-normal">{unit}</span></div>
      <div className="text-sm text-slate-300">{description}</div>
    </div>
  );
};

export default SummaryCard;