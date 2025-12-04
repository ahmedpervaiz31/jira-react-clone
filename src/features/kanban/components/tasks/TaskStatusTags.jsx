import React from 'react';
import { Tag } from 'antd';
import styles from '../modal/TaskDetailModal.module.css';

export const TaskStatusTags = ({ task }) => {
  const statusColor = task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'processing' : 'default';
  
  return (
    <div className={styles.tagsRow}>
      <Tag color={statusColor}>{task.status}</Tag>
      {task.dueDate && <Tag color="warning">Due: {new Date(task.dueDate).toLocaleDateString()}</Tag>}
    </div>
  );
};
