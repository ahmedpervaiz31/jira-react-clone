import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLUMNS_CONFIG } from '../../../utils/constants';
import KanbanView from './KanbanView';
import styles from './KanbanView.module.css'; 
import { createTask, deleteTaskAsync, moveTaskAsync, setTasksLocal, fetchTasks, selectTasksByBoard } from '../../../store/taskSlice';

import { selectBoards } from '../../../store/boardSlice';

// Stable empty object for selector defaults
const EMPTY_OBJ = {};


export const KanbanApp = () => {
  const { kanbanId } = useParams();
  const dispatch = useDispatch();
  const boards = useSelector(selectBoards);
  const board = boards.find((b) => b.id === kanbanId);
  const allTasks = useSelector((state) => selectTasksByBoard(state, kanbanId));
  const loading = useSelector((state) => state.tasks.loading);
  const tasksPage = useSelector((state) => state.tasks.tasksPage[kanbanId]) || EMPTY_OBJ;
  const tasksHasMore = useSelector((state) => state.tasks.tasksHasMore[kanbanId]) || EMPTY_OBJ;

  const loadMoreRefs = useRef({});

  useEffect(() => {
    if (!kanbanId) return;
    COLUMNS_CONFIG.forEach((col) => {
      if (tasksPage[col.id] === undefined) {
        dispatch(fetchTasks({ boardId: kanbanId, status: col.id, page: 1, limit: 20 }));
      }
    });
  }, [kanbanId, board]);

  useEffect(() => {
    const observers = {};
    COLUMNS_CONFIG.forEach((col) => {
      if (!loadMoreRefs.current[col.id]) return;
      observers[col.id] = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && tasksHasMore[col.id] !== false && !loading) {
          dispatch(fetchTasks({ boardId: kanbanId, status: col.id, page: (tasksPage[col.id] || 1) + 1, limit: 20 }));
        }
      }, { threshold: 1 });
      observers[col.id].observe(loadMoreRefs.current[col.id]);
    });
    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, [tasksHasMore, loading, tasksPage, kanbanId]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [addStatus, setAddStatus] = useState(null);

  const handleAddTask = (title, status, assignedTo = '', description = '', dueDate = null) => {
    const tasksInColumn = allTasks.filter(t => t.status === status);
    const maxOrder = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => (t.order !== undefined ? t.order : -1)))
      : -1;
    const payload = {
      title,
      status,
      boardId: kanbanId,
      assignedTo,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      order: maxOrder + 1,
    };
    dispatch(createTask(payload));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTaskAsync({ taskId: id }));
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setDetailVisible(true);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
    setDetailVisible(false);
  };

  const openAddModal = (status) => {
    setAddStatus(status);
    setAddVisible(true);
  };

  const closeAddModal = () => {
    setAddStatus(null);
    setAddVisible(false);
  };

  // Drag and drop logic
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const tasks = allTasks;
    const task = allTasks.find(t => t.id === draggableId);

    const sourceTasks = tasks
      .filter(t => t.status === source.droppableId)
      .sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));
    const updatedTasks = [...tasks];
    if (source.droppableId === destination.droppableId) {
      
      sourceTasks.splice(source.index, 1);
      sourceTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], order: idx };
        }
      });
    } else {
      
      const destTasks = tasks
        .filter(t => t.status === destination.droppableId)
        .sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));

      sourceTasks.splice(source.index, 1);
      
      const movedTask = { ...task, status: destination.droppableId };
      destTasks.splice(destination.index, 0, movedTask);
      
      const movedTaskIndex = updatedTasks.findIndex(ut => ut.id === task.id);
      if (movedTaskIndex >= 0) {
        updatedTasks[movedTaskIndex] = { ...updatedTasks[movedTaskIndex], status: destination.droppableId };
      }
      
      sourceTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], order: idx };
        }
      });
      destTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { 
            ...updatedTasks[taskIndex], 
            order: idx,
            status: destination.droppableId
          };
        }
      });
    }
    dispatch(setTasksLocal({ boardId: kanbanId, tasks: updatedTasks }));
    updatedTasks.forEach((t) => {
      dispatch(moveTaskAsync({ taskId: t.id, status: t.status, order: t.order }));
    });
  };

  if (!board) {
    if (loading || boards.length === 0) {
      return <div className={styles.notFound}>Loading...</div>;
    }
    return <div className={styles.notFound}>Board not found</div>;
  }
  
  return (
    <KanbanView
      title={board.name}
      columnsConfig={COLUMNS_CONFIG}
      tasks={allTasks}
      selectedTask={selectedTask}
      detailVisible={detailVisible}
      addVisible={addVisible}
      addStatus={addStatus}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onOpenTaskDetail={openTaskDetail}
      onCloseTaskDetail={closeTaskDetail}
      onOpenAddModal={openAddModal}
      onCloseAddModal={closeAddModal}
      onDragEnd={handleDragEnd}
      tasksPage={tasksPage}
      tasksHasMore={tasksHasMore}
      fetchMoreTasks={null}
      loadMoreRefs={loadMoreRefs}
      loading={loading}
    />
  );
};

export default KanbanApp;