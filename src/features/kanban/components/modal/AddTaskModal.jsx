import React, { useState } from 'react';
import { Modal, Input, Select, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './AddTaskModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsersAsync, selectUserSearchResults, selectUserSearchLoading } from '../../../../store/userSlice';

const { TextArea } = Input;

export const AddTaskModal = ({ visible, status, onClose, onAdd }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const userOptions = useSelector(selectUserSearchResults);
  const fetchingUsers = useSelector(selectUserSearchLoading);


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
    >
      <div className={styles.content}>
        <h3 className={styles.heading}>Add Task ({status})</h3>
        <Input
          className={styles.field}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          className={styles.field}
          showSearch
          placeholder="Assign to user"
          value={assignedTo || undefined}
          onChange={setAssignedTo}
          filterOption={false}
          notFoundContent={fetchingUsers ? 'Searching...' : null}
          optionLabelProp="label"
          onFocus={async () => {
            await dispatch(searchUsersAsync(''));
          }}
          onSearch={async (value) => {
            await dispatch(searchUsersAsync(value));
          }}
        >
          {(Array.isArray(userOptions) ? userOptions : []).map(user => (
            <Select.Option
              key={user.username}
              value={user.username}
              label={user.username}
            >
              {user.username}
            </Select.Option>
          ))}
        </Select>

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
