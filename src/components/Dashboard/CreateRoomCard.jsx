import React, { useState } from 'react';
import { Form, Input, Select, Checkbox, Button, message } from 'antd'; // Removed InputNumber
import { createStudyRoom } from '../../api/apiStudyRooms';
import { getCurrentUserId } from '../../api/apiTracking'; // Ensure this path is correct

const showNotification = (type, title, description) => {
  console.log(`Notification (${type}): ${title} - ${description}`);
  if (type === 'success') {
    message.success(`${title}: ${description}`);
  } else {
    message.error(`${title}: ${description}`);
  }
};

const categories = [
  { value: 'Physics', label: 'Physics' },
  { value: 'History and Evolution', label: 'History and Evolution' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Biology', label: 'Biology' },
  { value: 'Databases and Data', label: 'Databases and Data' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
  { value: 'Language Studies', label: 'Language Studies' },
  { value: 'Other', label: 'Other' }
];
const { Option } = Select;

const CreateRoomCard = () => {
  const [form] = Form.useForm();
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values) => {
    setIsLoading(true);
    const creatorId = getCurrentUserId();

    if (!creatorId) {
      showNotification('error', 'Error', 'Could not identify user. Please log in again.');
      setIsLoading(false);
      return;
    }

    // Prepare data for API
    // Set topic = name and maxparticipants = 10
    const roomData = {
      name: values.name, // From form
      topic: values.name, // Set topic same as name
      category: values.category, // From form
      maxparticipants: 10, // Hardcoded value
      ispublic: isPublic,
      creatorid: creatorId,
      // Set password to null if public, otherwise use value from form (if entered)
      password: isPublic ? null : values.password,
      // Optional: Add description if you keep the field, otherwise remove
      // description: values.description,
    };

    console.log("Submitting Simplified Quick Create Room:", roomData);

    try {
      const response = await createStudyRoom(roomData);
      showNotification('success', 'Room Created', `Room "${response.data.name}" created successfully!`);
      form.resetFields();
      setIsPublic(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to create room.";
      showNotification('error', 'Creation Failed', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicChange = (e) => {
    setIsPublic(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({ password: '' });
    }
  };

  return (
      <div className="flex-1 rounded-lg bg-slate-700 p-6 text-white shadow">
        <h3 className="mb-4 text-lg font-semibold">Quick Create Study Room</h3>

        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              ispublic_checkbox: true,
              // No need to set initial maxparticipants here anymore
            }}
            className="space-y-4"
        >
          {/* Room Name (Required) */}
          <Form.Item
              name="name"
              label={<span className="text-slate-300 text-sm font-medium">Room Name</span>}
              rules={[{ required: true, message: 'Please enter a room name!' }]}
              className="mb-0"
          >
            <Input
                placeholder="e.g., Evening Physics Prep"
                className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
            />
          </Form.Item>

          {/* Topic Input - REMOVED from UI */}
          {/* <Form.Item name="topic" ... /> */}

          {/* Category (Required) */}
          <Form.Item
              name="category"
              label={<span className="text-slate-300 text-sm font-medium">Category</span>}
              rules={[{ required: true, message: 'Please select a category!' }]}
              className="mb-0"
          >
            <Select
                placeholder="Select a category"
                className="[&>div]:!bg-slate-600 [&>div]:!text-white [&>div]:!border-slate-500 [&>div]:focus-within:!ring-sky-500 [&>div]:focus-within:!border-sky-500 [&>div]:focus:!ring-sky-500 [&>div]:focus:!border-sky-500 [&>div]:hover:!border-sky-500 [&_.ant-select-selection-placeholder]:!text-slate-400 [&_.ant-select-arrow]:!text-slate-400"
                popupClassName="bg-slate-700"
            >
              {categories.map(cat => (
                  <Option key={cat.value} value={cat.value} className="!text-white hover:!bg-slate-600 focus:!bg-slate-600">
                    {cat.label}
                  </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Max Participants Input - REMOVED from UI */}
          {/* <Form.Item name="maxparticipants" ... /> */}

          {/* Public/Private Checkbox */}
          <Form.Item name="ispublic_checkbox" valuePropName="checked" className="mb-0 mt-2">
            <Checkbox checked={isPublic} onChange={handlePublicChange} className="[&_.ant-checkbox-inner]:!bg-slate-600 [&_.ant-checkbox-inner]:!border-slate-500">
              <span className="text-slate-300 text-sm">Public Room?</span>
            </Checkbox>
          </Form.Item>

          {/* Password (Conditional) */}
          {!isPublic && (
              <Form.Item
                  name="password"
                  label={<span className="text-slate-300 text-sm font-medium">Password</span>}
                  rules={[{ required: !isPublic, message: 'Password required for private room!' }]}
                  className="mb-0"
              >
                <Input.Password
                    placeholder="Enter room password"
                    className="w-full rounded border border-slate-500 bg-slate-600 p-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400 [&>input]:!bg-slate-600 [&>input]:!text-white [&_.ant-input-suffix]:!text-slate-400"
                />
              </Form.Item>
          )}

          {/* Submit Button */}
          <Form.Item className="mt-6 mb-0">
            <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full rounded bg-sky-600 py-2 px-4 font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700 border-none h-auto"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default CreateRoomCard;
