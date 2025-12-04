import React from 'react';
import { TaskCard } from './tasks/TaskCard';
import { Card, Button } from 'antd';
import { ProfileOutlined, LoadingOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Columns.module.css';

const statusIcon = (status) => {
  switch (status) {
    case 'to_do':
      return <ProfileOutlined />;
    case 'in_progress':
      return <LoadingOutlined />;
    case 'done':
      return <CheckCircleOutlined />;
    default:
      return <ProfileOutlined />;
  }
};

export const BoardColumn = ({ title, status, tasks, onAddTask, onDeleteTask, onOpenDetail, onOpenAdd }) => {
  return (
    <Card
      className={styles.columnCard}
      title={
        <div className={styles.columnHeader}>
          <span className={styles.titleIcon}>{statusIcon(status)}</span>
          <span className={styles.titleText}>{title} ({tasks.length})</span>
        </div>
      }
      hoverable
      bordered={true}
    >
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} onOpenDetail={(t) => onOpenDetail && onOpenDetail(t)} />
        ))}
      </div>

      <div className={styles.actions}>
        <Button type="primary" icon={<PlusOutlined />} 
            onClick={() => onOpenAdd && onOpenAdd(status)}>
              Add Task
        </Button>
      </div>
    </Card>
  );
};