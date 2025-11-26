import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const TaskDescription = ({ description }) => {
  return (
    <div className="task-detail-description-section">
      <Title level={5}>More Info</Title>
      <div className="task-detail-description-content" dangerouslySetInnerHTML={{ __html: description || '<p>No additional details.</p>' }} />
    </div>
  );
};
