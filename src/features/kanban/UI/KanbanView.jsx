import React from 'react';
import { Row, Col, Typography } from 'antd';
import { DragDropContext } from '@hello-pangea/dnd';
import { BoardColumn } from '../components/Columns';
import { TaskDetailModal } from '../components/modal/TaskDetailModal'
import { AddTaskModal } from '../components/modal/AddTaskModal';
import styles from './KanbanView.module.css';

const { Title } = Typography;

const KanbanView = ({
  title,
  tasks,
  columnsConfig,
  selectedTask,
  detailVisible,
  addVisible,
  addStatus,
  onAddTask,
  onDeleteTask,
  onOpenTaskDetail,
  onCloseTaskDetail,
  onOpenAddModal,
  onCloseAddModal,
  onDragEnd,
}) => {
  const getTasksForColumn = (status) => {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => {
        return a.order - b.order;
      });
  };

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        {title}
      </Title>

      <div className={styles.boardScroll}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={16} justify="center" align="top" className={styles.row}>
            {columnsConfig.map((col) => (
              <Col key={col.id} span={8} className={styles.column}>
                <BoardColumn
                  title={col.title}
                  status={col.id}
                  tasks={getTasksForColumn(col.id)}
                  onAddTask={onAddTask}
                  onDeleteTask={onDeleteTask}
                  onOpenDetail={onOpenTaskDetail}
                  onOpenAdd={onOpenAddModal}
                />
              </Col>
            ))}
          </Row>
        </DragDropContext>
      </div>

      <TaskDetailModal
        visible={detailVisible}
        task={selectedTask}
        onClose={onCloseTaskDetail}
        onDelete={onDeleteTask}
      />

      <AddTaskModal
        visible={addVisible}
        status={addStatus}
        onClose={onCloseAddModal}
        onAdd={onAddTask}
      />
    </div>
  );
};

export default KanbanView;