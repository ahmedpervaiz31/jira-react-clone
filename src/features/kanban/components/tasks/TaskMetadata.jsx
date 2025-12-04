import React from 'react';
import { Avatar, Typography } from 'antd';
import styles from '../modal/TaskDetailModal.module.css';

const { Text } = Typography;

export const TaskMetadata = ({ task }) => {
  return (
    <div className={styles.metadataContainer}>
      <div className={styles.metadataRow}>
        <Avatar>{task.assignedTo ? task.assignedTo[0] : 'U'}</Avatar>
        <div>
          <div>
            <Text strong>{task.assignedTo || 'Unassigned'}</Text>
          </div>
          <div className={styles.date}>
            Assigned: {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
