import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TaskMetadata } from '../tasks/TaskMetadata';
import { TaskStatusTags } from '../tasks/TaskStatusTags';
import { TaskActions } from '../tasks/TaskActions';
import { TaskDescription } from '../tasks/TaskDescription';
import styles from './TaskDetailModal.module.css';

export const TaskDetailModal = ({ visible, task, onClose, onDelete }) => {
  if (!task) return null;

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete task',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this task?',
      okType: 'danger',
      onOk() {
        onDelete && onDelete(task.id);
        onClose && onClose();
      }
    });
  };

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
        <TaskActions onDelete={handleDelete} />
      </div>

      <TaskDescription description={task.description} />
    </Modal>
  );
};