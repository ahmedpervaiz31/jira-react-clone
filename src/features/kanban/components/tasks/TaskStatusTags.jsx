import React from 'react';
import { Tag } from 'antd';

export const TaskStatusTags = ({ task }) => {
  const statusColor = task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'processing' : 'default';
  
  return (
    <div className="task-detail-tags-row">
      <Tag color={statusColor}>{task.status}</Tag>
      {task.dueDate && <Tag color="warning">Due: {new Date(task.dueDate).toLocaleDateString()}</Tag>}
    </div>
  );
};
