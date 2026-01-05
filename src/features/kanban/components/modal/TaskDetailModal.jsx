import React, { useEffect, useState } from 'react';
import { Modal, Select, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { TaskMetadata } from '../tasks/TaskMetadata';
import { TaskStatusTags } from '../tasks/TaskStatusTags';
import DeleteButton from '../../../../components/DeleteButton';
import styles from './TaskDetailModal.module.css';

import { getTaskById, selectTasksByBoard } from '../../../../store/taskSlice';
import { validateDependenciesOnAdd } from '../../../../utils/dependencyHelpers';
import { useTaskSearch } from '../../../tasksearch/useTaskSearch';

const { Title } = Typography;

export const TaskDetailModal = ({ visible, task, onClose, onDelete, onUpdateDependencies }) => {
  const dispatch = useDispatch();

  const rawBoard = task?.boardId || task?.board;
  const boardId = (typeof rawBoard === 'object' && rawBoard !== null) ? rawBoard._id : rawBoard;

  const [dependencyDetails, setDependencyDetails] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [depError, setDepError] = useState('');

  const allBoardTasks = useSelector(state => selectTasksByBoard(state, boardId));

  // Use local board task search for dependencies (like AddTaskModal)
  const {
    tasks: searchTasks,
    inputValue: depSearchValue,
    setInputValue: setDepSearchValue,
    handleSearch: handleDepSearch
  } = useTaskSearch({
    includeBoards: false,
    includeTasks: true,
    boardId,
    autoLoad: true
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDependencies = async () => {
      if (!task || !Array.isArray(task.dependencies) || task.dependencies.length === 0) {
        setDependencyDetails([]);
        return;
      }
      try {
        const promises = task.dependencies.map(depId =>
          dispatch(getTaskById({ taskId: depId })).unwrap().catch(() => null)
        );
        const results = await Promise.all(promises);
        if (isMounted) {
          setDependencyDetails(results.filter(Boolean));
        }
      } catch (e) {
        if (isMounted) setDependencyDetails([]);
      }
    };

    fetchDependencies();
    setDependencies(task?.dependencies || []);
    setDepError('');
    setDepSearchValue('');
    
    return () => { isMounted = false; };
  }, [task, dispatch, boardId]);

  if (!task) return null;

  const handleUpdateDependencies = async () => {
    const validationPool = [
      ...(Array.isArray(allBoardTasks) ? allBoardTasks : []),
      ...(Array.isArray(searchTasks) ? searchTasks : []),
      ...(Array.isArray(dependencyDetails) ? dependencyDetails : [])
    ];

    const depCheck = await validateDependenciesOnAdd(task.title, dependencies, validationPool);
    
    if (!depCheck.valid) {
      setDepError(depCheck.error || 'Invalid dependencies');
      return;
    }
    
    setDepError('');
    if (onUpdateDependencies) {
      await onUpdateDependencies(task.id, dependencies);
    }
    onClose && onClose();
  };

  return (
    <Modal
      className={styles.modal}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      modalRenderToBody={true}
    >
      <div className={styles.header}>
        <div className={styles.infoLeft}>
          <h3 className={styles.title}>{task.title}</h3>
          <div className={styles.metadataContainer}>
            <TaskMetadata task={task} />
            <TaskStatusTags task={task} />
          </div>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <Title level={5} className={styles.descriptionTitle}>More Info</Title>
        <div
          className={styles.descriptionContent}
          dangerouslySetInnerHTML={{ __html: task.description || '<p>No additional details.</p>' }}
        />
      </div>

      <div className={styles.dependenciesSection}>
        <Title level={5} className={styles.dependenciesTitle}>Dependencies</Title>
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
          notFoundContent={searchTasks.length === 0 ? 'No tasks in this board' : 'No results'}
        >
          {searchTasks.filter(t => t.id !== task.id).map(taskItem => (
            <Select.Option
              key={taskItem.id || taskItem._id}
              value={taskItem.id || taskItem._id}
              label={taskItem.title}
              disabled={dependencies.includes(taskItem.id || taskItem._id)}
            >
              <div className={styles.optionLabel}>
                <span>{taskItem.title}</span>
                {taskItem.boardKey && (
                  <span className={styles.typeLabel}>{taskItem.boardKey}</span>
                )}
                <span className={styles.taskId}>
                  #{taskItem.displayId ? taskItem.displayId : String(taskItem.id || taskItem._id).slice(0,6)}
                </span>
                <span className={styles.taskTitle}>
                  {taskItem.status.replace('_', ' ')}
                </span>
              </div>
            </Select.Option>
          ))}
        </Select>
        {depError && <div className={styles.dependencyError}>{depError}</div>}
        <ul className={styles.dependenciesList}>
          {dependencyDetails.map((dep) => (
            <li key={dep._id || dep.id} className={styles.dependencyItem}>
              <span className={styles.dependencyName}>{dep.title || 'Untitled Task'}</span>
              <span className={styles.dependencyId}>#{dep.displayId}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.modalFooter}>
        <Button type="primary" onClick={handleUpdateDependencies} style={{ marginRight: 8 }}>
          Update Dependencies
        </Button>
        <DeleteButton
          icon={<DeleteOutlined />}
          onConfirm={() => {
            onDelete && onDelete(task.id);
            onClose && onClose();
          }}
          modalTitle="Delete this task?"
          modalContent="This action cannot be undone."
        />
      </div>
    </Modal>
  );
};