import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../../../utils/socket';
import DependencyBlockModal from '../components/modal/DependencyBlockModal';
import ForceRefreshModal from '../../../components/ForceRefreshModal';
import BoardDeletedRedirectModal from '../components/modal/BoardDeletedRedirectModal';
import BoardPresence from '../components/BoardPresence';
import { areDependenciesReady } from '../../../utils/dependencyHelpers';
import { useParams } from 'react-router-dom';
import { COLUMNS_CONFIG } from '../../../utils/constants';
import KanbanView from './KanbanView';
import styles from './KanbanView.module.css'; 
import { createTask, deleteTaskAsync, moveTaskAsync, setTasksLocal, 
  fetchTasks, selectTasksByBoard, selectTasksLoadingByBoard } from '../../../store/taskSlice';
import { selectBoards, deleteBoardAsync, removeBoardLocal } from '../../../store/boardSlice';
import { getIntermediateRank } from '../../../utils/lexorank';

const EMPTY_OBJ = {};

export const KanbanApp = () => {
  const { kanbanId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const boards = useSelector(selectBoards);
  const board = boards.find((b) => b.id === kanbanId);
  const allTasks = useSelector((state) => selectTasksByBoard(state, kanbanId));
  const loading = useSelector((state) => state.tasks.loading);
  const tasksPage = useSelector((state) => state.tasks.tasksPage[kanbanId]) || EMPTY_OBJ;
  const tasksHasMore = useSelector((state) => state.tasks.tasksHasMore[kanbanId]) || EMPTY_OBJ;
  
  const tasksTotal = useSelector((state) => state.tasks.tasksTotal[kanbanId]) || EMPTY_OBJ;
  const tasksLoading = useSelector((state) => selectTasksLoadingByBoard(state, kanbanId));
  
  const [boardUsers, setBoardUsers] = useState([]);
  const [forceRefresh, setForceRefresh] = useState({ visible: false, reason: '' });
  const [boardDeleted, setBoardDeleted] = useState({ visible: false, reason: '' });

  useEffect(() => {
    const taskEvents = ['task:created', 'task:updated', 'task:deleted', 'task:moved'];
    function handleTaskEvent({ boardId, userId }) {
      if (
        boardId === kanbanId && userId &&
        user?.id && userId !== user.id
      ) {
        setForceRefresh({ visible: true, reason: '' });
      }
    }
    function handleBoardDeleted({ boardId, userId }) {
      if (
        boardId === kanbanId && userId &&
        user?.id && userId !== user.id
      ) {
        dispatch(removeBoardLocal(boardId));
        setBoardDeleted({ visible: true, reason: 'This board was deleted by another user. You will be redirected to the main page.' });
      }
    }
    for (const event of taskEvents) {
      socket.on(event, handleTaskEvent);
    }
    socket.on('board:deleted', handleBoardDeleted);
    return () => {
      for (const event of taskEvents) {
        socket.off(event, handleTaskEvent);
      }
      socket.off('board:deleted', handleBoardDeleted);
    };
  }, [kanbanId, user?.id]);

  useEffect(() => {
    function handlePresence({ boardId, users }) {
      if (boardId === kanbanId) setBoardUsers(users || []);
    }
    socket.on('user:presence', handlePresence);
    return () => {
      socket.off('user:presence', handlePresence);
      setBoardUsers([]);
    };
  }, [kanbanId]);

  useEffect(() => {
    if (!kanbanId || !user) 
      return;
    if (!socket.connected) 
      socket.connect();
    socket.emit('join_board', { boardId: kanbanId, user });
    return () => { socket.emit('leave_board'); };
  }, [kanbanId, user]);

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

    const destColTasks = allTasks
      .filter(t => t.status === destination.droppableId && t.id !== draggableId)

    const prevTask = destColTasks[destination.index - 1];
    const nextTask = destColTasks[destination.index]; 

    const tempRank = getIntermediateRank(
      prevTask ? prevTask.order : null,
      nextTask ? nextTask.order : null
    );

    const optimisticallyUpdatedTask = { 
      ...task, 
      status: destination.droppableId, 
      order: tempRank 
    };

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

  if (boardDeleted.visible) {
    return <BoardDeletedRedirectModal visible={boardDeleted.visible} reason={boardDeleted.reason} />;
  }
  if (!board) {
    if (loading || boards.length === 0) {
      return <div className={styles.notFound}>Loading...</div>;
    }
    return <div className={styles.notFound}>Board not found</div>;
  }

  return (
    <>
      <ForceRefreshModal visible={forceRefresh.visible} reason={forceRefresh.reason} />
      <div style={{ position: 'relative', minHeight: 48 }}>
        <BoardPresence users={boardUsers} currentUserId={user?.id} />
      </div>
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