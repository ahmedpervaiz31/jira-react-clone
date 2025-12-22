import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, Tag } from 'antd';
import DeleteButton from '../../../../components/DeleteButton';
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
              <Tag color="blue">#{task.displayId ? task.displayId : String(task.id).slice(0,6)}</Tag>
              <div className={styles.title}>{task.title}</div>
              <div className={styles.actions}>
                <DeleteButton
                  icon={<DeleteOutlined />}
                  onConfirm={() => onDelete && onDelete(task.id)}
                  modalTitle="Delete this task?"
                  modalContent="This action cannot be undone."
                  buttonProps={{ onClick: (e) => e.stopPropagation() }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};