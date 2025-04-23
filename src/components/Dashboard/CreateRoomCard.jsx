// src/components/Dashboard/CreateRoomCard.jsx
import React from 'react';

const CreateRoomCard = () => {
  // Add state management (e.g., useState) for form inputs if needed
  return (
    <div className="flex-1 rounded-lg bg-slate-700 p-6 text-white shadow"> {/* Adjusted color & padding */}
      <h3 className="mb-4 text-lg font-semibold">Quick create study room</h3>
      <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div className="mb-4">
          <label htmlFor="roomName" className="mb-1 block text-sm font-medium text-slate-300">
            Room Name
          </label>
          <input
            type="text"
            id="roomName"
            className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="mb-6 flex items-center"> {/* Increased bottom margin */}
          <input
            id="privateRoom"
            name="privateRoom"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-500 bg-slate-600 text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="privateRoom" className="ml-2 block text-sm text-slate-300">
            Private room?
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-sky-600 py-2 px-4 font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoomCard;