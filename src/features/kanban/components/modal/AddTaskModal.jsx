import React, { useState, useEffect } from 'react';
import { validateDependenciesOnAdd } from '../../../../utils/dependencyHelpers';
import { Modal, Input, Select, Button, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './AddTaskModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsersAsync, selectUserSearchResults, selectUserSearchLoading } from '../../../../store/userSlice';
import { useTaskSearch } from '../../../tasksearch/useTaskSearch';

const { TextArea } = Input;

export const AddTaskModal = ({ visible, status, onClose, onAdd, boardId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const userOptions = useSelector(selectUserSearchResults);
  const fetchingUsers = useSelector(selectUserSearchLoading);

  const {
    tasks: allTasks,
    inputValue: depSearchValue,
    setInputValue: setDepSearchValue,
    handleSearch: handleDepSearch
  } = useTaskSearch({ includeBoards: false, includeTasks: true, boardId, autoLoad: true });
  const [dependencies, setDependencies] = useState([]);
  const [depError, setDepError] = useState('');

  useEffect(() => {
    if (!visible) {
      setDependencies([]);
      setDepError('');
      setDepSearchValue('');
    }
  }, [visible, boardId]);


  const handleOk = async () => {
    if (!title.trim() || !assignedTo.trim()) return;

    const depCheck = await validateDependenciesOnAdd(title.trim(), dependencies, allTasks);
    if (!depCheck.valid) {
      setDepError(depCheck.error || 'Invalid dependencies');
      return;
    }
    setDepError('');
    onAdd && onAdd(
      title.trim(),
      status,
      assignedTo.trim(),
      description.trim(),
      dueDate ? dueDate.toISOString() : null,
      dependencies
    );
    setTitle('');
    setAssignedTo('');
    setDescription('');
    setDueDate(null);
    setDependencies([]);
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

        <div className={styles.field}>
          <label className={styles.label}>Dependencies</label>
          <Select
            mode="multiple"
            placeholder="Search and select tasks as dependencies"
            value={dependencies}
            onChange={setDependencies}
            style={{ width: '100%' }}
            optionLabelProp="label"
            showSearch
            onSearch={value => handleDepSearch(value || '')}
            onFocus={() => handleDepSearch(depSearchValue || '')}
            filterOption={false}
            searchValue={depSearchValue}
            notFoundContent={allTasks.length === 0 ? 'No tasks in this board' : 'No results'}
          >
            {allTasks.filter(t => t.title !== title).map(task => (
              <Select.Option
                key={task.id || task._id}
                value={task.id || task._id}
                label={task.title}
                disabled={dependencies.includes(task.id || task._id)}
              >
                <div className={styles.optionLabel}>
                  <span>{task.title}</span>
                  {task.boardKey && (
                    <span className={styles.typeLabel}>{task.boardKey}</span>
                  )}
                  <span className={styles.taskId}>
                    #{task.displayId ? task.displayId : String(task.id || task._id).slice(0,6)}
                  </span>
                  <span className={styles.taskTitle}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
          {depError && <div className={styles.dependencyError}>{depError}</div>}
        </div>

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
