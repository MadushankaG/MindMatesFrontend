import React, { useState, useEffect } from 'react';
import AchievementCard from '../components/Achievements/AchievementCard';
import LoadingSpinner from '../components/smallComps/LoadingSpinner'; // Optional
import { getUserAchievements } from '../api/apiAchievements'; // Import API function

// --- Define Achievement Details (Client-Side) ---
// It's often easier to manage display details like descriptions, icons,
// and criteria checks on the client-side based on the AchievementType enum name
// received from the backend.
const achievementDetailsMap = {
  // Key should match the AchievementType enum name from backend
  KNOWLEDGE_EXPLORER: {
    title: 'Knowledge Explorer',
    description: 'Join 3 different subject rooms and spend 5 hours studying.',
    iconName: 'award', // Corresponds to iconMap in AchievementCard
    criteria: { rooms: 3, time: 5*3600, days: 0 }, // Store time in seconds
  },
  SPEED_LEARNER: {
    title: 'Speed Learner',
    description: 'Join 3 subject rooms, spend 10 hours studying, and study for 3 days in a row.',
    iconName: 'star',
    criteria: { rooms: 3, time: 10*3600, days: 3 },
  },
  MASTERMIND: {
    title: 'Mastermind',
    description: 'Join 5 subject rooms, spend 15 hours studying, and study for 3 days in a row.',
    iconName: 'trophy',
    criteria: { rooms: 5, time: 15*3600, days: 3 },
  },
  STREAK_SCHOLAR: {
    title: 'Streak Scholar',
    description: 'Join 5 subject rooms, spend 20 hours studying, and study for 5 days in a row.',
    iconName: 'award',
    criteria: { rooms: 5, time: 20*3600, days: 5 },
  },
  GUIDING_STAR: {
    title: 'Guiding Star',
    description: 'Join 10 subject rooms, spend 25 hours studying, and study for 5 days in a row.',
    iconName: 'trophy',
    criteria: { rooms: 10, time: 25*3600, days: 5 },
  },
  // Add entries for ALL your AchievementType enums from the backend
};
// --- End Achievement Details ---


const Achievements = () => {
  // State to hold the list of achievement *names* earned by the user
  const [earnedAchievementNames, setEarnedAchievementNames] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch earned achievements on component mount
  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming getUserAchievements returns { data: ["ACHIEVEMENT_NAME_1", "ACHIEVEMENT_NAME_2"] }
        const response = await getUserAchievements();
        if (response && Array.isArray(response.data)) {
          setEarnedAchievementNames(new Set(response.data)); // Store earned names in a Set for quick lookup
        } else {
          throw new Error("Invalid data format for user achievements.");
        }
      } catch (err) {
        console.error("Failed to fetch user achievements:", err);
        setError(err.message || "Could not load achievements.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []); // Empty dependency array runs once on mount

  // Prepare lists for rendering based on fetched data and the details map
  const allAchievementKeys = Object.keys(achievementDetailsMap);
  const earnedAchievements = allAchievementKeys
      .filter(key => earnedAchievementNames.has(key)) // Check if the key is in the fetched Set
      .map(key => ({ ...achievementDetailsMap[key], id: key, earned: true })); // Add id and earned status

  const lockedAchievements = allAchievementKeys
      .filter(key => !earnedAchievementNames.has(key)) // Filter keys NOT in the fetched Set
      .map(key => ({ ...achievementDetailsMap[key], id: key, earned: false })); // Add id and earned status


  // --- Render Logic ---
  if (isLoading) {
    return <div className="flex-1 bg-gray-100 p-6 lg:p-8 flex justify-center items-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="flex-1 bg-gray-100 p-6 lg:p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
      <div className="flex-1 bg-gray-100 p-6 lg:p-8 font-sans text-gray-900">
        <h2 className="text-h2 font-heading text-gray-800 mb-4">My Achievements</h2>
        <div className="mb-8 text-gray-600">
          <p>Unlocked: {earnedAchievements.length} / {allAchievementKeys.length} total badges.</p>
        </div>

        {/* Earned Achievements Section */}
        <section className="mb-10">
          <h3 className="text-h3 font-heading text-brand-dark mb-4 border-b pb-2">Unlocked Badges</h3>
          {earnedAchievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {earnedAchievements.map((ach) => (
                    <AchievementCard
                        key={ach.id} // Use the achievement key as the React key
                        title={ach.title}
                        description={ach.description}
                        iconName={ach.iconName}
                        earned={ach.earned}
                        criteria={ach.criteria} // Pass criteria for display if needed
                    />
                ))}
              </div>
          ) : (
              <p className="text-gray-500 italic">No badges unlocked yet. Keep studying!</p>
          )}
        </section>

        {/* Locked Achievements Section */}
        <section>
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
              <p className="text-green-600 font-semibold">Congratulations! All badges unlocked!</p>
          )}
        </section>

      </div>
  );
};

export default Achievements;
