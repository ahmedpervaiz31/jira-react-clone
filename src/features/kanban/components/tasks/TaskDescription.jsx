import React from 'react';
import { Typography } from 'antd';
import styles from '../modal/TaskDetailModal.module.css';

const { Title } = Typography;

export const TaskDescription = ({ description }) => {
  return (
    <div className={styles.descriptionSection}>
      <Title level={5} className={styles.descriptionTitle}>More Info</Title>
      <div
        className={styles.descriptionContent}
        dangerouslySetInnerHTML={{ __html: description || '<p>No additional details.</p>' }}
      />
    </div>
  );
};
