import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLUMNS_CONFIG, migrateTasksOrder } from '../utils/constants';
import KanbanView from './KanbanView';
import { addTask, deleteTask, moveTask, setTasks, selectBoardById } from '../../../store/kanbanSlice';

export const KanbanApp = () => {
  const { kanbanId } = useParams();
  const board = useSelector((state) => selectBoardById(state, kanbanId));
  const tasks = board ? board.tasks : [];
  const dispatch = useDispatch();

  const lastId = useMemo(() => {
    const numericIds = tasks.map((t) => parseInt(t.id, 10)).filter(Boolean);
    return numericIds.length ? Math.max(...numericIds) : 0;
  }, [tasks]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [addStatus, setAddStatus] = useState(null);


  const handleAddTask = (title, status, assignedTo = '', description = '', dueDate = null) => {
    const nextId = lastId + 1;
    const tasksInColumn = tasks.filter(t => t.status === status);
    const maxOrder = tasksInColumn.length > 0 
      ? Math.max(...tasksInColumn.map(t => t.order !== undefined ? t.order : -1))
      : -1;
    const newTask = {
      id: nextId.toString(),
      title,
      status,
      assignedTo,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
    };
    dispatch(addTask({ boardId: kanbanId, task: newTask }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask({ boardId: kanbanId, taskId: id }));
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

  useEffect(() => {
    const tasksNeedingMigration = tasks.some(task => task.order === undefined || task.order === null);
    if (tasksNeedingMigration && tasks.length > 0) {
      const migratedTasks = migrateTasksOrder(tasks);
      dispatch(setTasks({ boardId: kanbanId, tasks: migratedTasks }));
    }
  }, [kanbanId]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Cancel if dropped in same position
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) return;

    // Find dragged task
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Get tasks from source column, sorted by order
    const sourceTasks = tasks
      .filter(t => t.status === source.droppableId)
      .sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));

    // Create updated tasks array
    const updatedTasks = [...tasks];

    if (source.droppableId === destination.droppableId) {
      // Same column reorder
      sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, task);
      
      // Recalculate order for all tasks in column
      sourceTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], order: idx };
        }
      });
    } else {
      // Cross-column move
      const destTasks = tasks
        .filter(t => t.status === destination.droppableId)
        .sort((a, b) => (a.order !== undefined ? a.order : 0) - (b.order !== undefined ? b.order : 0));

      // Remove from source
      sourceTasks.splice(source.index, 1);
      
      // Add to destination with new status
      const movedTask = { ...task, status: destination.droppableId };
      destTasks.splice(destination.index, 0, movedTask);

      // Update the moved task in updatedTasks first
      const movedTaskIndex = updatedTasks.findIndex(ut => ut.id === task.id);
      if (movedTaskIndex >= 0) {
        updatedTasks[movedTaskIndex] = { ...updatedTasks[movedTaskIndex], status: destination.droppableId };
      }

      // Recalculate order for source column
      sourceTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], order: idx };
        }
      });

      // Recalculate order for destination column
      destTasks.forEach((t, idx) => {
        const taskIndex = updatedTasks.findIndex(ut => ut.id === t.id);
        if (taskIndex >= 0) {
          updatedTasks[taskIndex] = { 
            ...updatedTasks[taskIndex], 
            order: idx,
            status: destination.droppableId // Ensure status is updated
          };
        }
      });
    }

    dispatch(moveTask({ boardId: kanbanId, tasks: updatedTasks }));
  };

  if (!board) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Board not found.</div>;
  }
  return (
    <KanbanView
      tasks={tasks}
      columnsConfig={COLUMNS_CONFIG}
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
    />
  );
};

export default KanbanApp;