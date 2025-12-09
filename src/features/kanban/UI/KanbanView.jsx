import React from 'react';
import { Row, Col, Typography } from 'antd';
import { DragDropContext } from '@hello-pangea/dnd';
import { BoardColumn } from '../components/Columns';
import { TaskDetailModal } from '../components/modal/TaskDetailModal'
import { AddTaskModal } from '../components/modal/AddTaskModal';
import styles from './KanbanView.module.css';

const { Title } = Typography;

const KanbanView = ({
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
        const orderA = a.order !== undefined ? a.order : 0;
        const orderB = b.order !== undefined ? b.order : 0;
        return orderA - orderB;
      });
  };

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        Kanban Board
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