import React from 'react';
import {
  FaAward, FaLock, FaStar, FaCheckCircle, FaTrophy, // Badge Icons
  FaUsers, FaClock, FaCalendarAlt // Criteria Icons
} from 'react-icons/fa';

const iconMap = {
  award: FaAward,
  lock: FaLock,
  star: FaStar,
  check: FaCheckCircle,
  trophy: FaTrophy,
  default: FaAward,
};

const formatCriteria = (criteria = {}) => {
  const parts = [];
  if (criteria.rooms != null) {
    parts.push({ icon: FaUsers, text: `${criteria.rooms} Rooms` });
  }
  if (criteria.time != null && criteria.time > 0) {
    // --- Convert seconds to hours ---
    const hours = Math.round(criteria.time / 3600); // Calculate hours
    parts.push({ icon: FaClock, text: `${hours} Hrs` }); // Display hours
    // --- End Conversion ---
  }
  if (criteria.days != null && criteria.days > 0) { // Only show days if > 0
    parts.push({ icon: FaCalendarAlt, text: `${criteria.days} Days` });
  }
  return parts;
};

const AchievementCard = ({
                           title = "Achievement Title",
                           description = "Achievement description goes here.",
                           iconName = "default",
                           earned = false,
                           criteria = {},
                         }) => {
  const IconComponent = iconMap[iconName] || iconMap.default;
  const formattedCriteria = formatCriteria(criteria);

  const containerClasses = earned
      ? "bg-white border border-brand-medium"
      : "bg-gray-50 border border-gray-300";
  const iconClasses = earned ? "text-brand-medium" : "text-gray-400";
  const titleClasses = earned ? "text-gray-900" : "text-gray-700";
  const criteriaTextClasses = earned ? "text-gray-600" : "text-gray-500";
  const criteriaIconClasses = earned ? "text-brand-medium" : "text-gray-400";

  return (
      <div
          className={`rounded-lg shadow-md p-4 flex flex-col items-center text-center ${containerClasses}`}
          title={description}
      >
        <div className={`relative mb-2 text-4xl ${iconClasses}`}>
          <IconComponent />
          {!earned && (
              <FaLock className="absolute -top-1 -right-1 text-xs text-gray-300 bg-gray-500 rounded-full p-0.5" />
          )}
        </div>

        <h3 className={`text-base font-heading font-bold mb-2 ${titleClasses}`}>
          {title}
        </h3>

        {formattedCriteria.length > 0 && (
            <div className={`flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm mb-2 ${criteriaTextClasses}`}>
              {formattedCriteria.map((item, index) => (
                  <span key={index} className="flex items-center" title={item.text}>
              <item.icon className={`mr-1 w-3.5 h-3.5 ${criteriaIconClasses}`} />
                    {item.text}
            </span>
              ))}
            </div>
        )}

      </div>
  );
};

export default AchievementCard;
