import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd'; // Import Ant Design components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { joinStudyRoom } from '../../api/apiStudyRooms'; // Import the API function

// Placeholder notification (replace with your actual system if needed)
const showNotification = (type, title, description) => {
  console.log(`Notification (${type}): ${title} - ${description}`);
  if (type === 'success') {
    message.success(`${title}: ${description}`);
  } else {
    message.error(`${title}: ${description}`);
  }
};

const JoinRoomCard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Hook for navigation
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  // Handle form submission
  const handleFinish = async (values) => {
    setIsLoading(true);
    const { roomId, password } = values; // Get values from form

    console.log(`Attempting to join room: ${roomId}`);

    try {
      // Call the API function (it gets userId from token internally)
      // Pass roomId and the optional password
      const response = await joinStudyRoom(roomId, password);

      // On success, navigate to the room detail page
      // Assuming the response contains the joined room details,
      // though we only need the roomId for navigation here.
      showNotification('success', 'Joined Room', `Successfully joined room ${roomId}!`);
      navigate(`/study-rooms/${roomId}`); // Redirect to the room detail page
      form.resetFields(); // Clear form after successful join

    } catch (error) {
      let errorMsg = "Failed to join room.";
      // Handle specific errors based on status code or message from backend API function
      if (error.response) {
        // Use message from backend response if available
        errorMsg = error.response.data?.message || error.response.data || `Error: ${error.response.status}`;
        // Customize messages for known status codes from the join endpoint
        if (error.response.status === 404) {
          errorMsg = "Room not found. Please check the Room ID.";
        } else if (error.response.status === 401) { // Assuming 401 for incorrect password
          errorMsg = "Incorrect password for this room.";
        } else if (error.response.status === 409) { // Assuming 409 is Room Full
          errorMsg = "This room is currently full.";
        } else if (error.response.status === 400) {
          errorMsg = `Invalid request: ${error.response.data || 'Please check inputs.'}`;
        }
      } else {
        // Handle network errors or errors thrown before request
        errorMsg = error.message || errorMsg;
      }
      showNotification('error', 'Join Failed', errorMsg);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
      // Use the existing card styling
      <div className="flex-1 rounded-lg bg-slate-700 p-6 text-white shadow">
        <h3 className="mb-4 text-lg font-semibold">Join Study Room</h3>
        <Form
            form={form}
            layout="vertical" // Labels above inputs
            onFinish={handleFinish} // Call handleFinish on submit
            className="space-y-4" // Add spacing
        >
          {/* Room ID Input (Required) */}
          <Form.Item
              name="roomId"
              label={<span className="text-slate-300 text-sm font-medium">Room ID</span>}
              rules={[{ required: true, message: 'Please enter the Room ID!' }]}
              className="mb-0" // Adjust Antd default margins
          >
            <Input
                placeholder="Enter the ID of the room to join"
                className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
            />
          </Form.Item>

          {/* Password Input (Optional) */}
          <Form.Item
              name="password"
              label={<span className="text-slate-300 text-sm font-medium">Password (if required)</span>}
              // No 'required' rule here, as it's optional
              className="mb-0"
          >
            <Input.Password
                placeholder="Enter room password if private"
                className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400 [&>input]:!bg-slate-600 [&>input]:!text-white [&_.ant-input-suffix]:!text-slate-400"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mt-6 mb-0">
            <Button
                type="primary"
                htmlType="submit"
                loading={isLoading} // Show loading state
                className="w-full rounded bg-sky-600 py-2 px-4 font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700 border-none h-auto" // Adjusted styling
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default JoinRoomCard;
