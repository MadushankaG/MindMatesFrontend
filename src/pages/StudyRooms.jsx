// src/pages/StudyRooms.jsx
import React, { useState, useEffect } from 'react';

// 1. VERIFY: Is this path EXACTLY correct?
//    Does the file exist at src/components/StudyRooms/StudyRoomCard.jsx?
//    Does it have 'export default StudyRoomCard;'?
import StudyRoomCard from '../components/StudyRooms/StudyRoomCard';

// 2. VERIFY: Is this path EXACTLY correct?
//    Does the file exist at src/components/StudyRooms/RoomSearchFilter.jsx?
//    Does it have 'export default RoomSearchFilter;'?
//    Are there errors in the console related to this file?
import RoomSearchFilter from '../components/StudyRooms/RoomSearchFilter';

// --- Sample Data (Okay for now) ---
const sampleRooms = [
  { id: 1, title: 'All About Physics', description: 'We are a bunch of physics nerds trying to pass our exams', imageUrl: 'https://via.placeholder.com/400x150/777/FFF?text=Physics+Image', memberCount: 10, memberLimit: 15, isPrivate: false, category: 'Physics' },
  { id: 2, title: 'Music Lovers', description: 'Music is an universal language for a reason...', imageUrl: 'https://via.placeholder.com/400x150/666/FFF?text=Music+Image', memberCount: 5, memberLimit: 8, isPrivate: false, category: 'Miscellaneous' },
  { id: 3, title: 'Data and Databases', description: 'Studying for MIT Kelaniya 2024 Sem1. All Welcome to Join', imageUrl: 'https://via.placeholder.com/400x150/555/FFF?text=DB+Image', memberCount: 3, memberLimit: 40, isPrivate: true, category: 'Databases and Data' },
  { id: 4, title: 'IELTS Exam Help', description: 'Speaking practice session for IELTS exams', imageUrl: 'https://via.placeholder.com/400x150/444/FFF?text=IELTS+Image', memberCount: 10, memberLimit: 15, isPrivate: false, category: 'Language Studies' },
  { id: 5, title: 'Advanced Algorithms', description: 'Discussing complex algorithms and data structures.', imageUrl: 'https://via.placeholder.com/400x150/333/FFF?text=Algo+Image', memberCount: 7, memberLimit: 20, isPrivate: false, category: 'Software Engineering' },
  { id: 6, title: 'World History Debates', description: 'Debating historical events and figures.', imageUrl: 'https://via.placeholder.com/400x150/222/FFF?text=History+Image', memberCount: 12, memberLimit: 25, isPrivate: false, category: 'History and Evolution' },
];
// --- End Sample Data ---


const StudyRooms = () => {
  const [rooms, setRooms] = useState(sampleRooms);
  // useEffect(() => { /* Add API fetching logic here later */ }, []);

  return (
    // Main container - sets up flex row layout on medium screens and up
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 p-6 lg:p-8 font-sans">

      {/* Left Column: Room Grid */}
      {/* Takes 2/3 width on medium screens and up */}
      <div className="w-full md:w-2/3">
        <h2 className="text-h2 font-heading text-gray-800 mb-6">Browse All Study Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mapping looks correct */}
          {rooms.map((room) => (
            <StudyRoomCard
              key={room.id}
              title={room.title}
              description={room.description}
              imageUrl={room.imageUrl}
              memberCount={room.memberCount}
              memberLimit={room.memberLimit}
              isPrivate={room.isPrivate}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Search/Filter Sidebar */}
      {/* Takes 1/3 width on medium screens and up */}
      {/* 3. CHECK: Is this div rendering? Use browser inspector */}
      <div className="w-full md:w-1/3">
        {/* 4. CHECK: Is RoomSearchFilter component being rendered here? */}
        {/* Any console errors related to it? */}
        <RoomSearchFilter />
      </div>

    </div>
  );
};

// Export looks correct
export default StudyRooms;