import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { selectAllTasksFlattened } from '../../../store/kanbanSlice';
import styles from './TaskPage.module.css';

import { TaskMetadata } from '../../kanban/components/tasks/TaskMetadata';
import { TaskStatusTags } from '../../kanban/components/tasks/TaskStatusTags';
import { TaskDescription } from '../../kanban/components/tasks/TaskDescription';

const TaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const tasks = useSelector(selectAllTasksFlattened);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return <div className={styles.notFound}>Task not found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{task.title}</h1>
            <div className={styles.metadataContainer}>
              <TaskMetadata task={task} />
              <TaskStatusTags task={task} />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.descriptionSection}>
          <TaskDescription description={task.description} />
        </div>

        <div className={styles.footer}>
          <Button onClick={() => navigate(-1)} size="large">
            Back
          </Button>
        </div>

      </div>
    </div>
  );
};

export default TaskPage;