import React from 'react';
import { TaskCard } from './tasks/TaskCard';
import { Card, Typography, Button } from 'antd';
import { ProfileOutlined, LoadingOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{statusIcon(status)}</span>
          <span style={{ fontWeight: 600 }}>{title} ({tasks.length})</span>
        </div>
      }
      hoverable
      bordered={false}
      style={{ 
        width: '100%',
        minWidth: 280,
        backgroundColor: '#fafafa', 
        margin: '0 20px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)'
      }}
      bodyStyle={{ padding: '12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} onOpenDetail={(t) => onOpenDetail && onOpenDetail(t)} />
        ))}
      </div>

      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onOpenAdd && onOpenAdd(status)}>Add Task</Button>
      </div>
    </Card>
  );
};