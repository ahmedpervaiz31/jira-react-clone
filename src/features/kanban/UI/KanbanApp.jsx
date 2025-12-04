import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { COLUMNS_CONFIG } from '../utils/constants';
import KanbanView from './KanbanView';
import { addTask, deleteTask } from '../kanbanSlice';

export const KanbanApp = () => {
  const tasks = useSelector((state) => state.kanban.tasks);
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
    const newTask = {
      id: nextId.toString(),
      title,
      status,
      assignedTo,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
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
    />
  );
};

export default KanbanApp;
