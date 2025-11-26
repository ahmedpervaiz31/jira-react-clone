import React from 'react';
import { Avatar, Space, Typography } from 'antd';
const { Text } = Typography;

export const TaskMetadata = ({ task }) => {
  return (
    <div className="task-detail-metadata-container">
      <div className="task-detail-metadata-row">
        <Avatar>{task.assignedTo ? task.assignedTo[0] : 'U'}</Avatar>
        <div>
          <div>
            <Text strong>{task.assignedTo || 'Unassigned'}</Text>
          </div>
          <div className="task-detail-date">
            Assigned: {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
