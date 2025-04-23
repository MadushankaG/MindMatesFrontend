// src/pages/Achievements.jsx
import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/Achievements/AchievementCard'; // Adjust path if needed

// --- Sample Data Based on Badge Criteria Image ---
const sampleAchievements = [
  {
    id: 'badge_knowledge_explorer',
    title: 'Knowledge Explorer',
    description: 'Join 3 different subject rooms and spend 5 hours studying.',
    iconName: 'award',
    earned: true,
    criteria: { rooms: 3, time: 5, days: null },
  },
  {
    id: 'badge_speed_learner',
    title: 'Speed Learner',
    description: 'Join 3 subject rooms, spend 10 hours studying, and study for 3 days in a row.',
    iconName: 'star',
    earned: true,
    criteria: { rooms: 3, time: 10, days: 3 },
  },
  {
    id: 'badge_mastermind',
    title: 'Mastermind',
    description: 'Join 5 subject rooms, spend 15 hours studying, and study for 3 days in a row.',
    iconName: 'trophy',
    earned: false,
    criteria: { rooms: 5, time: 15, days: 3 },
  },
  {
    id: 'badge_streak_scholar',
    title: 'Streak Scholar',
    description: 'Join 5 subject rooms, spend 20 hours studying, and study for 5 days in a row.',
    iconName: 'award',
    earned: false,
    criteria: { rooms: 5, time: 20, days: 5 },
  },
  {
    id: 'badge_guiding_star',
    title: 'Guiding Star',
    description: 'Join 10 subject rooms, spend 25 hours studying, and study for 5 days in a row.',
    iconName: 'trophy',
    earned: false,
    criteria: { rooms: 10, time: 25, days: 5 },
  },
];
// --- End Sample Data ---

const Achievements = () => {
  const [achievements, setAchievements] = useState(sampleAchievements);
  // Add loading/error states if fetching data later

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    // Main container
    <div className="flex-1 bg-gray-100 p-6 lg:p-8 font-sans text-gray-900">

      {/* Page Title */}
      <h2 className="text-h2 font-heading text-gray-800 mb-4">My Achievements</h2>

      {/* Optional Summary Stats */}
      <div className="mb-8 text-gray-600">
        <p>Unlocked: {earnedAchievements.length} / {achievements.length} total badges.</p>
      </div>

      {/* Earned Achievements Section */}
      <section className="mb-10">
        {/* Updated text color for section title */}
        <h3 className="text-h3 font-heading text-brand-dark mb-4 border-b pb-2">Unlocked Badges</h3>
        {earnedAchievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {earnedAchievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                title={ach.title}
                description={ach.description}
                iconName={ach.iconName}
                earned={ach.earned}
                criteria={ach.criteria}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No badges unlocked yet. Keep up the great work!</p>
        )}
      </section>

      {/* Locked Achievements Section */}
      <section>
         {/* Updated text color for section title */}
        <h3 className="text-h3 font-heading text-brand-dark mb-4 border-b pb-2">Locked Badges</h3>
         {lockedAchievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {lockedAchievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                title={ach.title}
                description={ach.description}
                iconName={ach.iconName}
                earned={ach.earned}
                criteria={ach.criteria}
              />
            ))}
          </div>
         ) : (
           <p className="text-gray-500 italic">All badges unlocked!</p>
         )}
      </section>

    </div>
  );
};

// Ensure default export
export default Achievements;
