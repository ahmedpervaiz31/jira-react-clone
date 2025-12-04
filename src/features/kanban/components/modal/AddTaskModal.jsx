import React, { useState } from 'react';
import { Modal, Input, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './AddTaskModal.module.css';

const { TextArea } = Input;

export const AddTaskModal = ({ visible, status, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const handleOk = () => {
    if (!title.trim() || !assignedTo.trim()) return;
    onAdd && onAdd(
      title.trim(),
      status,
      assignedTo.trim(),
      description.trim(),
      dueDate ? dueDate.toISOString() : null
    );
    setTitle('');
    setAssignedTo('');
    setDescription('');
    setDueDate(null);
    onClose && onClose();
  };

  return (
    <Modal
      className={styles.modal}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div className={styles.content}>
        <h3 className={styles.heading}>Add Task ({status})</h3>
        <Input
          className={styles.field}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          className={styles.field}
          placeholder="Assigned to"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />

        <TextArea
          className={styles.field}
          placeholder="More info / description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <DatePicker
          className={styles.datePicker}
          value={dueDate}
          onChange={(d) => setDueDate(d)}
        />

        <div className={styles.actions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleOk}>
            Add Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
