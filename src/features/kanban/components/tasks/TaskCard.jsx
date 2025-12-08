import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, Tag, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './TaskCard.module.css';

export const TaskCard = ({ task, index, onDelete, onOpenDetail }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.draggableWrapper} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          <Card
            size="small"
            hoverable
            bordered={false}
            className={styles.taskCard}
            onClick={() => onOpenDetail && onOpenDetail(task)}
          >
            <div className={styles.content}>
              <Tag color="blue">#{task.id}</Tag>
              <div className={styles.title}>{task.title}</div>
              <div className={styles.actions}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task.id); }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};