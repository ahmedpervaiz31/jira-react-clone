import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Alert } from 'antd';
import api from '../../../utils/api';
import styles from './TaskPage.module.css';

import { TaskMetadata } from '../../kanban/components/tasks/TaskMetadata';
import { TaskStatusTags } from '../../kanban/components/tasks/TaskStatusTags';

import { Typography } from 'antd';

const { Title } = Typography;

const TaskPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError('Task not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <div className={styles.container}><Spin /></div>;
  if (error || !task) return (
    <div className={styles.container}>
      <Alert message={error || "Task not found"} type="error" />
      <div className={styles.footer}>
        <Button onClick={() => navigate(-1)} size="large">Back</Button>
      </div>
    </div>
  );

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
          <Title level={5} className={styles.descriptionTitle}>More Info</Title>
          <div
            className={styles.descriptionContent}
            dangerouslySetInnerHTML={{ __html: task.description || '<p>No additional details.</p>' }}
          />
        </div>
        <div className={styles.footer}>
          <Button className={styles.backButton} onClick={() => navigate(-1)} size="large">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;