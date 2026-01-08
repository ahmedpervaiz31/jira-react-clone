import React, { useState, useEffect, useRef } from 'react';
import DependencyBlockModal from '../components/modal/DependencyBlockModal';
import { areDependenciesReady } from '../../../utils/dependencyHelpers';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLUMNS_CONFIG } from '../../../utils/constants';
import KanbanView from './KanbanView';
import styles from './KanbanView.module.css'; 
import { createTask, deleteTaskAsync, moveTaskAsync, setTasksLocal, 
  fetchTasks, selectTasksByBoard, selectTasksLoadingByBoard } from '../../../store/taskSlice';
import { selectBoards } from '../../../store/boardSlice';
import { getIntermediateRank } from '../../../utils/lexorank';

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
    const payload = {
      title,
      status,
      boardId: kanbanId,
      assignedTo,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
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
    if (!task || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // 1. Identify neighbors in the destination column
    const destColTasks = allTasks
      .filter(t => t.status === destination.droppableId && t.id !== draggableId)
      .sort((a, b) => a.order.localeCompare(b.order));

    const prevTask = destColTasks[destination.index - 1];
    const nextTask = destColTasks[destination.index]; // Currently at the target spot

    // 2. Generate an optimistic temporary rank
    const tempRank = getIntermediateRank(
      prevTask ? prevTask.order : null,
      nextTask ? nextTask.order : null
    );

    // 3. Create the updated task object
    const optimisticallyUpdatedTask = { 
      ...task, 
      status: destination.droppableId, 
      order: tempRank 
    };

    // 4. Update the local list
    const otherTasks = allTasks.filter(t => t.id !== draggableId);
    const updatedTasks = [...otherTasks, optimisticallyUpdatedTask];

    dispatch(setTasksLocal({
      boardId: kanbanId,
      tasks: updatedTasks,
      totals: tasksTotal
    }));

    const isMovingToNewCol = source.droppableId !== destination.droppableId;
    if (isMovingToNewCol && (destination.droppableId === 'in_progress' || destination.droppableId === 'done')) {
      if (Array.isArray(task.dependencies) && task.dependencies.length > 0) {
        const depStatus = await areDependenciesReady(task.id, destination.droppableId);
        
        if (!depStatus.ready) {
          setDepBlockModal({ visible: true, blockingTasks: depStatus.blocking || [] });
          dispatch(setTasksLocal({
            boardId: kanbanId,
            tasks: lastValidTasksRef.current,
            totals: lastValidTotalsRef.current
          }));
          return;
        }
      }
    }

  dispatch(moveTaskAsync({
      taskId: task.id,
      status: destination.droppableId,
      prevRank: prevTask ? prevTask.order : null,
      nextRank: nextTask ? nextTask.order : null
    }));
  };
  useEffect(() => {
    lastValidTasksRef.current = allTasks;
    lastValidTotalsRef.current = tasksTotal;
  }, [allTasks, tasksTotal]);

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