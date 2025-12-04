import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from '../modal/TaskDetailModal.module.css';

export const TaskActions = ({ onDelete }) => {
  return (
    <div className={styles.actions}>
      <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
