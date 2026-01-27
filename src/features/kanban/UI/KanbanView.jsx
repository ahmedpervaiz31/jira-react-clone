import React from 'react';
import { Row, Col, Typography } from 'antd';
import { DragDropContext } from '@hello-pangea/dnd';
import { BoardColumn } from '../components/Columns';
import { TaskDetailModal } from '../components/modal/TaskDetailModal'
import { AddTaskModal } from '../components/modal/AddTaskModal';
import styles from './KanbanView.module.css';
import ChatBot from '../../../components/chatbot/ChatBot';

const { Title } = Typography;


const KanbanView = ({
  boardId,
  title,
  tasks,
  columnsConfig,
  selectedTask,
  detailVisible,
  addVisible,
  addStatus,
  tasksTotal,
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
  tasksLoading,
  loading,
}) => {
  const getTasksForColumn = (status) => {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order.localeCompare(b.order));
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
              const colLoading = tasksLoading && tasksLoading[col.id];
              const colHasMore = tasksHasMore && tasksHasMore[col.id];
              const colTasks = getTasksForColumn(col.id);
              
              const totalCount = (tasksTotal && typeof tasksTotal[col.id] === 'number') ? tasksTotal[col.id] : colTasks.length;
              const displayedCount = Math.min(colTasks.length, totalCount);

              return (
                <Col key={col.id} span={8} className={styles.column}>
                  <BoardColumn
                    title={col.title}
                    status={col.id}
                    tasks={colTasks}
                    tasksTotal={totalCount}
                    onAddTask={onAddTask}
                    onDeleteTask={onDeleteTask}
                    onOpenDetail={onOpenTaskDetail}
                    onOpenAdd={onOpenAddModal}
                  />
                  <div className={styles.paginationContainer}>
                      <span className={styles.displayCount}>{`${displayedCount} out of ${totalCount} displayed`}</span>
                    {colHasMore ? (
                      <button
                        className={styles.loadMoreBtn}
                        disabled={!!colLoading}
                        onClick={() => fetchMoreTasks && fetchMoreTasks(col.id)}
                      >
                        {colLoading ? 'Loading...' : 'Load more'}
                      </button>
                    ) : null}
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
        boardId={boardId}
      />
      <ChatBot />
    {window.isAuthenticated && <ChatBot />}
    </div>
  );
};

export default KanbanView;