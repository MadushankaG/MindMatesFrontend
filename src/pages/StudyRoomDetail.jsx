import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudyRoomDetails } from '../api/apiStudyRooms';
import { startTracking, stopTracking } from '../api/apiTracking';
import { checkUserAchievements } from '../api/apiAchievements';
import LoadingSpinner from '../components/smallComps/LoadingSpinner';
import defaultRoomImage from '../assets/images/StudyRoomDefault.png';
import { FiUsers, FiVideo, FiTag, FiInfo, FiCheckSquare, FiXSquare, FiAward } from 'react-icons/fi';

const showNotification = (type, title, description, duration = 4.5) => {
    console.log(`Notification (${type}): ${title} - ${description}`);
    if (type === 'success' && title.includes('Achievement')) {
        alert(`🏆 Achievement Unlocked! 🏆\n${title}\n${description}`);
    } else {
        alert(`${title}: ${description}`);
    }

};


const StudyRoomDetail = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStudying, setIsStudying] = useState(false);
    const [lastDuration, setLastDuration] = useState(null);
    const [isButtonLoading, setIsButtonLoading] = useState(false);


    useEffect(() => {
        if (!roomId) {
            setError("No Room ID provided.");
            setIsLoading(false);
            return;
        }
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            setLastDuration(null);
            setIsStudying(false);
            try {
                const response = await getStudyRoomDetails(roomId);
                if (response && response.data) {
                    setRoom(response.data);
                } else {
                    throw new Error("Room not found or invalid data received.");
                }
            } catch (err) {
                console.error(`Error fetching room details for ${roomId}:`, err);
                setError(err.response?.data?.message || err.message || "Failed to load room details.");
                setRoom(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [roomId]);


    const handleJoinAndStart = async () => {
        if (!roomId || !room?.videoMeetingUrl) {
            showNotification('error', 'Error', 'Cannot join meeting. Room details or meeting URL missing.');
            return;
        };
        setIsButtonLoading(true);
        setLastDuration(null);
        try {
            await startTracking(roomId);
            setIsStudying(true);
            window.open(room.videoMeetingUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Failed to start tracking:", error);
            showNotification('error', 'Error', `Could not start study session tracking: ${error.message}`);
        } finally {
            setIsButtonLoading(false);
        }
    };

    const handleDoneStudying = async () => {
        if (!roomId) return;
        setIsButtonLoading(true);
        let stopResponseData = null;
        try {
            const response = await stopTracking(roomId);
            stopResponseData = response?.data; // Store response data
            setIsStudying(false);
            console.log("stopTracking successful:", stopResponseData);

            if (stopResponseData?.durationSeconds != null) {
                const duration = stopResponseData.durationSeconds;
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const durationString = `Session duration: ${minutes}m ${seconds}s`;
                setLastDuration(durationString);
                showNotification('success', 'Session Ended', durationString);
            } else {
                setLastDuration('Session ended.');
                showNotification('success', 'Session Ended', 'Your study session tracking has stopped.');
            }

            // --- Check for achievements AFTER stopping successfully ---
            try {
                console.log("Checking for new achievements...");
                const achievementResponse = await checkUserAchievements();
                const newlyEarned = achievementResponse?.data; // Assuming backend returns array directly in data

                if (Array.isArray(newlyEarned) && newlyEarned.length > 0) {
                    console.log("Newly earned achievements:", newlyEarned);
                    // Show notification for each new achievement
                    newlyEarned.forEach(achievementName => {
                        // You might want a mapping from enum name (e.g., KNOWLEDGE_EXPLORER) to display name/description
                        showNotification(
                            'success',
                            `Achievement Unlocked: ${achievementName.replace(/_/g, ' ')}`, // Basic formatting
                            'Congratulations!',
                            10 // Show achievement notification longer
                        );
                    });
                } else {
                    console.log("No new achievements earned.");
                }
            } catch (achievementError) {
                console.error("Failed to check for achievements:", achievementError);
                // Don't necessarily show error to user unless critical
            }
            // --- End Achievement Check ---

        } catch (error) {
            console.error("Failed to stop tracking:", error);
            showNotification('error', 'Error', `Could not stop study session tracking: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsButtonLoading(false);
        }
    };


    const handleImageError = (event) => {
        event.target.onerror = null;
        event.target.src = defaultRoomImage;
    };

    if (isLoading) { return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>; }
    if (error) { return <div className="text-center p-10 text-red-500">Error: {error} <Link to="/study-rooms" className="text-blue-600 block mt-4">Back</Link></div>; }
    if (!room) { return <div className="text-center p-10 text-gray-500">Room not found. <Link to="/study-rooms" className="text-blue-600 block mt-4">Back</Link></div>; }

    return (
        <div className="container mx-auto p-4 md:p-8 font-sans">
            <div className="mb-6">
                <Link to="/study-rooms" className="text-blue-600 hover:text-blue-800 transition-colors duration-150 inline-flex items-center">
                    &larr; Back to Study Rooms
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                    src={room.imageUrl || defaultRoomImage}
                    alt={`${room.name} banner`}
                    className="w-full h-48 md:h-64 object-cover"
                    onError={handleImageError}
                />
                <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-800 mb-2 sm:mb-0">
                            {room.name}
                        </h1>

                        {room.videoMeetingUrl ? (
                            isStudying ? (
                                <button
                                    onClick={handleDoneStudying}
                                    disabled={isButtonLoading}
                                    className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors duration-150 inline-flex items-center cursor-pointer ${isButtonLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <FiXSquare className="mr-2" /> {isButtonLoading ? 'Stopping...' : 'Done Studying'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoinAndStart}
                                    disabled={isButtonLoading}
                                    className={`bg-brand-medium hover:bg-opacity-80 text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors duration-150 inline-flex items-center cursor-pointer ${isButtonLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <FiVideo className="mr-2" /> {isButtonLoading ? 'Starting...' : 'Join Meeting & Start Tracking'}
                                </button>
                            )
                        ) : (
                            <span className="text-gray-500 italic text-sm">Meeting link not available</span>
                        )}

                    </div>

                    {lastDuration && (
                        <div className="text-sm text-green-700 font-medium mb-4 p-2 bg-green-100 rounded border border-green-300">
                            {lastDuration}
                        </div>
                    )}


                    <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-x-4 gap-y-1">
             <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
              <FiTag className="mr-1.5" /> Category: {room.category || 'N/A'}
            </span>
                        <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
              <FiUsers className="mr-1.5" /> Participants: {room.participants?.length || 0} / {room.maxparticipants || 'N/A'}
            </span>
                        <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded">
               <FiInfo className="mr-1.5" /> Status: {room.ispublic ? 'Public' : 'Private'}
            </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold font-heading text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {room.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold font-heading text-gray-700 mb-3">Participants ({room.participants?.length || 0})</h2>
                        {room.participants && room.participants.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {room.participants.map((participantId) => (
                                    <li key={participantId}>User ID: {participantId}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No participants currently in the room.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudyRoomDetail;
