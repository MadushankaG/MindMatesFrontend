import React from 'react';
import { FiClock, FiTrendingUp, FiZap } from 'react-icons/fi';

const iconMap = {
  clock: FiClock,
  trend: FiTrendingUp,
  streak: FiZap,
  default: FiTrendingUp,
};

const StatCard = ({ title, value, unit = '', iconName = 'default' }) => {
  const IconComponent = iconMap[iconName] || iconMap.default;

  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-200 flex items-center space-x-4">
      <div className="flex-shrink-0 bg-brand-light p-3 rounded-full">
        <IconComponent className="w-5 h-5 text-brand-dark" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-2xl font-bold font-heading text-brand-dark">
          {value} <span className="text-lg font-sans font-normal">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
