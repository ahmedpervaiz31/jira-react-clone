import React from 'react';

import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { TaskMetadata } from '../tasks/TaskMetadata';
import { TaskStatusTags } from '../tasks/TaskStatusTags';
import DeleteButton from '../../../../components/DeleteButton';
import styles from './TaskDetailModal.module.css';

import { Typography } from 'antd';

const { Title } = Typography;

export const TaskDetailModal = ({ visible, task, onClose, onDelete }) => {
  if (!task) return null;

  return (
    <Modal
      className={styles.modal}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      modalRenderToBody={true}
    >
      <div className={styles.header}>
        <div className={styles.infoLeft}>
          <h3 className={styles.title}>{task.title}</h3>
          <div className={styles.metadataContainer}>
            <TaskMetadata task={task} />
            <TaskStatusTags task={task} />
          </div>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <Title level={5} className={styles.descriptionTitle}>More Info</Title>
        <div
          className={styles.descriptionContent}
          dangerouslySetInnerHTML={{ __html: task.description || '<p>No additional details.</p>' }}
        />
      </div>

      <div className={styles.modalFooter}>
        <DeleteButton
          icon={<DeleteOutlined />}
          onConfirm={() => {
            onDelete && onDelete(task.id);
            onClose && onClose();
          }}
          modalTitle="Delete this task?"
          modalContent="This action cannot be undone."
        />
      </div>
    </Modal>
  );
};