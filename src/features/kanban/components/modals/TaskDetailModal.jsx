import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TaskMetadata } from '../tasks/TaskMetadata';
import { TaskStatusTags } from '../tasks/TaskStatusTags';
import { TaskActions } from '../tasks/TaskActions';
import { TaskDescription } from '../tasks/TaskDescription';
import './TaskDetailModal.css';

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
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      maskStyle={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <div className="task-detail-header">
        <div className="task-detail-info-left">
          <h3 className="task-detail-title">{task.title}</h3>
          <div className="task-detail-metadata-container">
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