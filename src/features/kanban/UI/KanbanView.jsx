import React from 'react';
import { Row, Col, Typography } from 'antd';
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
}) => {
  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        Kanban Board
      </Title>

      <div className={styles.boardScroll}>

        <Row gutter={16} justify="center" align="top" className={styles.row}>
          {columnsConfig.map((col) => (
            <Col key={col.id} span={8} className={styles.column}>
              <BoardColumn
                title={col.title}
                status={col.id}
                tasks={tasks.filter((t) => t.status === col.id)}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
                onOpenDetail={onOpenTaskDetail}
                onOpenAdd={onOpenAddModal}
              />
            </Col>
          ))}
        </Row>
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
