// src/components/Dashboard/JoinRoomCard.jsx
import React from 'react';

const JoinRoomCard = () => {
  // Add state management (e.g., useState) for form inputs if needed
  return (
    <div className="flex-1 rounded-lg bg-slate-700 p-6 text-white shadow"> {/* Adjusted color & padding */}
      <h3 className="mb-4 text-lg font-semibold">Join study room</h3>
      <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div className="mb-4">
          <label htmlFor="roomId" className="mb-1 block text-sm font-medium text-slate-300">
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="mb-6"> {/* Increased bottom margin */}
          <label htmlFor="joinName" className="mb-1 block text-sm font-medium text-slate-300">
             Join Name {/* Changed label based on image */}
          </label>
          <input
            type="text"
            id="joinName"
            className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
         {/* Spacer to align button better if needed, or adjust mb-6 above */}
         {/* <div className="h-[36px] mb-4"></div> */}
        <button
          type="submit"
          className="w-full rounded bg-sky-600 py-2 px-4 font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoomCard;