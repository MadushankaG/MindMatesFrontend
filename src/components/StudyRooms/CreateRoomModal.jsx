// src/components/StudyRooms/CreateRoomModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Checkbox, Button } from 'antd';

// Example categories (reuse from RoomSearchFilter or fetch dynamically later)
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
const { TextArea } = Input;

/**
 * Modal component for creating a new study room.
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {function} props.onCreate - Function to call when the form is submitted successfully. Receives form values.
 * @param {function} props.onCancel - Function to call when the modal is cancelled or closed.
 * @param {boolean} props.loading - Whether the creation process is loading.
 */
const CreateRoomModal = ({ open, onCreate, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [isPublic, setIsPublic] = useState(true); // Default to public

    // Reset form fields when the modal is closed/reopened
    useEffect(() => {
        if (!open) {
            form.resetFields();
            setIsPublic(true); // Reset public state as well
        }
    }, [open, form]);

    // Handle form submission
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Add the isPublic state to the values object before calling onCreate
                onCreate({ ...values, ispublic: isPublic });
                // Keep the modal open while loading, close handled by parent on success/cancel
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Handle change of the public/private checkbox
    const handlePublicChange = (e) => {
        setIsPublic(e.target.checked);
        // If switching to public, clear the password field
        if (e.target.checked) {
            form.setFieldsValue({ password: '' });
        }
    };

    return (
        <Modal
            open={open}
            title="Create New Study Room"
            okText="Create Room"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleOk} // Use the custom handler
            confirmLoading={loading} // Show loading state on OK button
            destroyOnClose // Destroy form state when modal is closed
            maskClosable={!loading} // Prevent closing by clicking mask when loading
            keyboard={!loading} // Prevent closing by Esc key when loading
        >
            <Form
                form={form}
                layout="vertical"
                name="create_room_form"
                initialValues={{
                    // Set initial values, especially for controlled components like checkbox
                    ispublic: true,
                    maxparticipants: 10, // Default max participants
                }}
            >
                {/* Room Name */}
                <Form.Item
                    name="name"
                    label="Room Name"
                    rules={[{ required: true, message: 'Please input the room name!' }]}
                >
                    <Input placeholder="e.g., Physics Study Group" />
                </Form.Item>

                {/* Topic */}
                <Form.Item
                    name="topic"
                    label="Topic"
                    rules={[{ required: true, message: 'Please input the main topic!' }]}
                >
                    <Input placeholder="e.g., Quantum Mechanics" />
                </Form.Item>

                {/* Category */}
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map(cat => (
                            <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Description */}
                <Form.Item
                    name="description"
                    label="Description"
                    // Optional field, no required rule
                >
                    <TextArea rows={3} placeholder="Briefly describe the room's purpose (optional)" />
                </Form.Item>

                {/* Max Participants */}
                <Form.Item
                    name="maxparticipants"
                    label="Max Participants"
                    rules={[{ required: true, message: 'Please set the maximum number of participants!' }]}
                >
                    <InputNumber min={2} max={100} style={{ width: '100%' }} />
                </Form.Item>

                {/* Public/Private Toggle */}
                <Form.Item name="ispublic_checkbox" valuePropName="checked">
                    <Checkbox checked={isPublic} onChange={handlePublicChange}>
                        Public Room (No password required)
                    </Checkbox>
                </Form.Item>

                {/* Password (Conditional) */}
                {!isPublic && ( // Only show if isPublic is false
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: !isPublic, // Required only if room is private
                                message: 'Please input a password for the private room!',
                            },
                        ]}
                        extra="Required for private rooms."
                    >
                        <Input.Password placeholder="Enter room password" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default CreateRoomModal;
