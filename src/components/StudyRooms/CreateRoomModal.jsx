// src/components/StudyRooms/CreateRoomModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Checkbox, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// Complete list of example categories
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

// Helper function for Form.Item to extract file list
const normFile = (e) => {
    console.log('[CreateRoomModal] normFile event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    // Ensure e.fileList is an array; if not, return empty array or handle appropriately
    return e && Array.isArray(e.fileList) ? e.fileList : [];
};


/**
 * Modal component for creating a new study room.
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {function} props.onCreate - Function to call when the form is submitted successfully. Receives form values and the selected file object.
 * @param {function} props.onCancel - Function to call when the modal is cancelled or closed.
 * @param {boolean} props.loading - Whether the creation process is loading.
 */
const CreateRoomModal = ({ open, onCreate, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [isPublic, setIsPublic] = useState(true);
    // We still need fileList state to *control* the Upload component's display
    const [fileList, setFileList] = useState([]);

    // Reset form fields and file list when the modal is closed/reopened
    useEffect(() => {
        if (!open) {
            form.resetFields(); // Resets form fields including the Upload item
            setIsPublic(true);
            setFileList([]); // Also clear our local state for the controlled component
        }
    }, [open, form]);

    // Handle form submission
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // --- Get file from form values ---
                // 'upload' is the name of the Form.Item for the Upload component.
                // normFile ensures 'values.upload' is an array (or empty array).
                const currentFileList = values.upload || [];
                const file = currentFileList.length > 0 ? currentFileList[0]?.originFileObj : null;
                // --- End file extraction ---

                console.log('[CreateRoomModal] File object extracted from form values in handleOk:', file);

                // Pass form values AND the extracted file object (or null) to the parent handler
                // We exclude the 'upload' field itself from the values passed on, as it contains the Ant file object structure
                const { upload, ...restValues } = values;
                onCreate({ ...restValues, ispublic: isPublic }, file);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Handle change of the public/private checkbox
    const handlePublicChange = (e) => {
        setIsPublic(e.target.checked);
        if (e.target.checked) {
            form.setFieldsValue({ password: '' });
        }
    };

    // Props for the Upload component
    const uploadProps = {
        onRemove: (file) => {
            setFileList([]); // Clear local state when file is removed
            form.setFieldsValue({ upload: [] }); // Also clear the form item value
            return true;
        },
        beforeUpload: (file) => {
            // Perform validation
            const isJpgOrPngOrGif = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
            if (!isJpgOrPngOrGif) {
                message.error('You can only upload JPG/PNG/GIF file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
            }

            // Update local state *only if valid* to control the displayed list
            if (isJpgOrPngOrGif && isLt2M) {
                setFileList([file]); // Update state for display
                console.log('[CreateRoomModal] File added to fileList state (for display):', file);
            } else {
                setFileList([]); // Clear state if invalid
                form.setFieldsValue({ upload: [] }); // Clear form item value if invalid
            }

            // Prevent antd default upload, we handle it manually
            return false;
        },
        fileList, // Control the displayed list from local state
        listType: "picture",
        maxCount: 1,
    };

    return (
        <Modal
            open={open}
            title="Create New Study Room"
            okText="Create Room"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            destroyOnClose
            maskClosable={!loading}
            keyboard={!loading}
        >
            <Form
                form={form}
                layout="vertical"
                name="create_room_form"
                initialValues={{ ispublic: true, maxparticipants: 10 }}
            >
                {/* Room Name, Topic, Category, Description, Max Participants... (Same as before) */}
                <Form.Item
                    name="name"
                    label="Room Name"
                    rules={[{ required: true, message: 'Please input the room name!' }]}
                >
                    <Input placeholder="e.g., Physics Study Group" />
                </Form.Item>
                <Form.Item
                    name="topic"
                    label="Topic"
                    rules={[{ required: true, message: 'Please input the main topic!' }]}
                >
                    <Input placeholder="e.g., Quantum Mechanics" />
                </Form.Item>
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
                <Form.Item name="description" label="Description (Optional)">
                    <TextArea rows={3} placeholder="Briefly describe the room's purpose" />
                </Form.Item>
                <Form.Item
                    name="maxparticipants"
                    label="Max Participants"
                    rules={[{ required: true, message: 'Please set the maximum number of participants!' }]}
                >
                    <InputNumber min={2} max={100} style={{ width: '100%' }} />
                </Form.Item>

                {/* Image Upload Component */}
                <Form.Item
                    name="upload" // This name connects the Upload component to the form's values
                    label="Room Image (Optional)"
                    // Use getValueFromEvent to ensure the form item's value is the file list
                    getValueFromEvent={normFile}
                    // No need for valuePropName="fileList" when using getValueFromEvent and controlling state separately
                >
                    {/* Pass uploadProps which now uses local fileList state for display */}
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Form.Item>

                {/* Public/Private Checkbox */}
                <Form.Item name="ispublic_checkbox" valuePropName="checked">
                    <Checkbox checked={isPublic} onChange={handlePublicChange}>
                        Public Room (No password required)
                    </Checkbox>
                </Form.Item>

                {/* Password Input (Conditional Rendering) */}
                {!isPublic && (
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: !isPublic, message: 'Please input a password for the private room!' }]}
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
