import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Tag } from 'antd';
import { selectAllTasksFlattened } from '../../../store/kanbanSlice';
import styles from './TaskPage.module.css';

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
      <Card className={styles.card} title={<>
        <Tag color="blue">{task.displayId || String(task.id).slice(0,6)}</Tag> {task.title}
      </>}>
        <div className={styles.meta}><b>Status:</b> <Tag>{task.status}</Tag></div>
        <div className={styles.meta}><b>Board:</b> {task.boardName} <Tag>{task.boardKey}</Tag></div>
        {task.assignedTo && <div className={styles.meta}><b>Assigned To:</b> {task.assignedTo}</div>}
        {task.description && <div className={styles.meta}><b>Description:</b> {task.description}</div>}
        {task.dueDate && <div className={styles.meta}><b>Due Date:</b> {new Date(task.dueDate).toLocaleDateString()}</div>}
        <div className={styles.actions}>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </Card>
    </div>
  );
};

export default TaskPage;
