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
  tasksPage,
  tasksHasMore,
  fetchMoreTasks,
  loadMoreRefs,
  loading,
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
            {columnsConfig.map((col) => {
              const colLoading = loading && (tasksPage && tasksPage[col.id] !== undefined);
              const colHasMore = tasksHasMore && tasksHasMore[col.id];
              return (
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
                  <div
                    ref={el => { if (loadMoreRefs && loadMoreRefs.current) loadMoreRefs.current[col.id] = el; }}
                    className={styles.paginationContainer}
                  >
                    {colLoading && colHasMore !== false && <span>Loading more tasks...</span>}
                    {colHasMore === false && !colLoading && (
                      <span style={{ color: '#888', fontSize: 12 }}>All tasks loaded.</span>
                    )}
                  </div>
                </Col>
              );
            })}
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