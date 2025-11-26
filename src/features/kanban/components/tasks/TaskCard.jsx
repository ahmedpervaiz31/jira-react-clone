import React from 'react';
import { Card, Tag, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const TaskCard = ({ task, onDelete, onOpenDetail }) => {
  return (
    <Card
      size="small"
      hoverable
      bordered={false}
      style={{ marginBottom: 8, cursor: 'pointer' }}
      bodyStyle={{ padding: '8px' }}
      onClick={() => onOpenDetail && onOpenDetail(task)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag color="blue">#{task.id}</Tag>
        <div style={{ flex: 1 }}>{task.title}</div>
        <div style={{ marginLeft: 8 }}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task.id); }}
          />
        </div>
      </div>
    </Card>
  );
};