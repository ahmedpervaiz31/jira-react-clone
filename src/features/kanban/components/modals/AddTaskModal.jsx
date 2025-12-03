import React, { useState } from 'react';
import { Modal, Input, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const AddTaskModal = ({ visible, status, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const handleOk = () => {
    if (!title.trim() || !assignedTo.trim()) return;
    onAdd && onAdd(title.trim(), status, assignedTo.trim(), description.trim(), dueDate ? dueDate.toISOString() : null);
    setTitle(''); setAssignedTo(''); setDescription(''); setDueDate(null);
    onClose && onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      maskStyle={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.45)'}}
    >
      <h3 style={{ marginBottom: 12 }}>
          Add Task ({status})
      </h3>
      <Input placeholder="Title" value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ marginBottom: 8 }} />

      <Input placeholder="Assigned to" value={assignedTo} 
          onChange={(e) => setAssignedTo(e.target.value)} 
          style={{ marginBottom: 8 }} />

      <TextArea placeholder="More info / description" value={description} 
          onChange={(e) => setDescription(e.target.value)} rows={4} 
          style={{ marginBottom: 8 }} />

      <DatePicker style={{ width: '100%', marginBottom: 12 }} value={dueDate} 
          onChange={(d) => setDueDate(d)} />

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>
            Cancel
        </Button>
        
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOk}>
            Add Task
        </Button>
      </div>
    </Modal>
  );
};
