// src/components/StudyRooms/RoomSearchFilter.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';
// Import useNavigate if you plan to navigate to other pages
// import { useNavigate } from 'react-router-dom';

// Example categories, fetch these dynamically later
const categories = [
  'Physics', 'History and Evolution', 'Software Engineering', 'Biology',
  'Databases and Data', 'Geography', 'Miscellaneous', 'Language Studies', 'Other'
];

const RoomSearchFilter = () => {
  // const navigate = useNavigate(); // Initialize if using navigation

  // --- Define Handler Functions ---
  const handleJoinWithIdClick = () => {
    console.log('Join with ID button clicked');
    // ** TODO: Replace alert with actual logic **
    alert('Join with ID button clicked! (Implement functionality here)');
  };

  const handleCreateNewClick = () => {
    console.log('Create New button clicked');
    // ** TODO: Replace alert with actual logic **
    alert('Create New button clicked! (Implement functionality here)');
  };
  // --- End Handler Functions ---

  return (
    // Container styling
    <div className="bg-white rounded-lg shadow p-5 space-y-6 font-sans">

      {/* Action Buttons - Changed to White Background / Dark Text */}
      <div className="grid grid-cols-2 gap-3">
         <button
            onClick={handleJoinWithIdClick} // onClick handler
            // White bg, dark text, gray border, gray hover bg
            className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white"
         >
            Join with ID
         </button>
         <button
            onClick={handleCreateNewClick} // onClick handler
            // White bg, dark text, gray border, gray hover bg
            className="w-full rounded-md bg-white border border-gray-300 py-2 px-3 text-sm font-semibold text-brand-dark shadow-sm transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-1 focus:ring-offset-white"
         >
           Create New
         </button>
      </div>
      {/* End Action Buttons */}


      {/* Search Section */}
      <div>
        <h3 className="text-base font-semibold font-heading mb-3 text-gray-700">Search For Rooms</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search room name..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-brand-medium focus:outline-none focus:ring-1 focus:ring-brand-medium"
          />
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      {/* End Search Section */}


      {/* Categories Section */}
      <div>
        <h3 className="text-base font-semibold font-heading mb-3 text-gray-700">Room Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                // Use brand-medium for the checkbox color
                className="h-4 w-4 rounded border-gray-300 text-brand-medium shadow-sm focus:ring-brand-medium focus:ring-offset-white"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
      {/* End Categories Section */}

    </div> // End Container
  );
};

// Make sure to export default
export default RoomSearchFilter;
