import React, { useState, useEffect, useRef } from 'react';
import DependencyBlockModal from '../components/modal/DependencyBlockModal';
import { areDependenciesReady } from '../../../utils/dependencyHelpers';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLUMNS_CONFIG } from '../../../utils/constants';
import KanbanView from './KanbanView';
import styles from './KanbanView.module.css'; 
import { createTask, deleteTaskAsync, moveTaskRateLimit, setTasksLocal, 
        fetchTasks, selectTasksByBoard, selectTasksLoadingByBoard } from '../../../store/taskSlice';
import { selectBoards } from '../../../store/boardSlice';

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
  
  const tasksTotal = useSelector((state) => state.tasks.tasksTotal[kanbanId]) || EMPTY_OBJ;
  const tasksLoading = useSelector((state) => selectTasksLoadingByBoard(state, kanbanId));

  useEffect(() => {
    if (!kanbanId) return;
    
    COLUMNS_CONFIG.forEach((col) => {
      dispatch(fetchTasks({ boardId: kanbanId, status: col.id, skip: 0, limit: 12 }));
    });
  }, [kanbanId, dispatch]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [addStatus, setAddStatus] = useState(null);
  const [depBlockModal, setDepBlockModal] = useState({ visible: false, blockingTasks: [] });
  const lastValidTasksRef = useRef([]);
  const lastValidTotalsRef = useRef({});

  const handleAddTask = (title, status, assignedTo = '', description = '', dueDate = null, dependencies = []) => {
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
      dependencies 
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


  const fetchMoreTasks = (status) => {
    const currentCount = allTasks.filter(t => t.status === status).length;
    
    dispatch(fetchTasks({ 
      boardId: kanbanId, 
      status, 
      skip: currentCount, 
      limit: 12 
    }));
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const task = allTasks.find(t => t.id === draggableId);
    if (!task) return;

    lastValidTasksRef.current = [...allTasks];
    lastValidTotalsRef.current = { ...tasksTotal };

    const isMovingToNewCol = source.droppableId !== destination.droppableId;
    if (isMovingToNewCol && (destination.droppableId === 'in_progress' || destination.droppableId === 'done') &&
      Array.isArray(task.dependencies) && task.dependencies.length > 0) {
      const depStatus = await areDependenciesReady(task.id, destination.droppableId);
      if (!depStatus.ready) {
        setDepBlockModal({ visible: true, blockingTasks: depStatus.blocking || [] });
        setTimeout(() => {
          dispatch(setTasksLocal({
            boardId: kanbanId,
            tasks: lastValidTasksRef.current,
            totals: lastValidTotalsRef.current
          }));
        }, 350);
        return;
      }
    }

    let updatedTasks = [...allTasks];
    const updatedTasksTotal = { ...tasksTotal };

    if (source.droppableId === destination.droppableId) {
      // same col
      if (source.index === destination.index) return;

      const columnTasks = updatedTasks
        .filter(t => t.status === source.droppableId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const [moved] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, moved);

      columnTasks.forEach((t, idx) => {
        const index = updatedTasks.findIndex(ut => ut.id === t.id);
        if (index >= 0) {
          updatedTasks[index] = { ...updatedTasks[index], order: idx };
        }
      });
    } else {
      // move to other col
      const prevSource = updatedTasksTotal[source.droppableId] || 0;
      updatedTasksTotal[source.droppableId] = Math.max(prevSource - 1, 0);

      const prevDest = updatedTasksTotal[destination.droppableId] || 0;
      updatedTasksTotal[destination.droppableId] = prevDest + 1;

      const sourceTasks = updatedTasks
        .filter(t => t.status === source.droppableId && t.id !== task.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      sourceTasks.forEach((t, idx) => {
        const index = updatedTasks.findIndex(ut => ut.id === t.id);
        if (index >= 0) updatedTasks[index] = { ...updatedTasks[index], order: idx };
      });

      const destTasks = updatedTasks
        .filter(t => t.status === destination.droppableId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const movedTask = { ...task, status: destination.droppableId };

      destTasks.splice(destination.index, 0, movedTask);

      destTasks.forEach((t, idx) => {
        const index = updatedTasks.findIndex(ut => ut.id === t.id);
        if (index >= 0) {
          updatedTasks[index] = { ...updatedTasks[index], order: idx, status: destination.droppableId };
        }
      });
    }
    //update tasks and total together
    dispatch(setTasksLocal({
      boardId: kanbanId,
      tasks: updatedTasks,
      totals: updatedTasksTotal
    }));

    updatedTasks.forEach((t) => {
      dispatch(moveTaskRateLimit({ taskId: t.id, status: t.status, order: t.order }));
    });
  };

  if (!board) {
    if (loading || boards.length === 0) {
      return <div className={styles.notFound}>Loading...</div>;
    }
    return <div className={styles.notFound}>Board not found</div>;
  }
  
  return (
    <>
      <KanbanView
        boardId={kanbanId}
        title={board.name}
        columnsConfig={COLUMNS_CONFIG}
        tasks={allTasks}
        selectedTask={selectedTask}
        detailVisible={detailVisible}
        addVisible={addVisible}
        addStatus={addStatus}
        tasksTotal={tasksTotal}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onOpenTaskDetail={openTaskDetail}
        onCloseTaskDetail={closeTaskDetail}
        onOpenAddModal={openAddModal}
        onCloseAddModal={closeAddModal}
        onDragEnd={handleDragEnd}
        tasksPage={tasksPage}
        tasksHasMore={tasksHasMore}
        fetchMoreTasks={fetchMoreTasks}
        tasksLoading={tasksLoading}
        loading={loading}
      />
      <DependencyBlockModal
        visible={depBlockModal.visible}
        onClose={() => setDepBlockModal({ visible: false, blockingTasks: [] })}
        blockingTasks={depBlockModal.blockingTasks}
      />
    </>
  );
};

export default KanbanApp;