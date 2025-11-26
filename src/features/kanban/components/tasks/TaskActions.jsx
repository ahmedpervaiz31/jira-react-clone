import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const TaskActions = ({ onDelete }) => {
  return (
    <div className="task-detail-actions">
      <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
