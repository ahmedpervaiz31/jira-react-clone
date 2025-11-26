import React from 'react';
import { Row, Col, Typography } from 'antd';
import { BoardColumn } from '../components/Columns';
import { TaskDetailModal } from '../components/modals/TaskDetailModal';
import { AddTaskModal } from '../components/modals/AddTaskModal';

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
    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '18px' }}>
        Kanban Board
      </Title>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        <Row gutter={16} justify="center" align="top" style={{ width: '100%' }}>
          {columnsConfig.map((col) => (
            <Col key={col.id} span={8} style={{ marginBottom: '20px' }}>
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
