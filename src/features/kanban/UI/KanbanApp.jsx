import React, { useState } from 'react';
import { INITIAL_TASKS, COLUMNS_CONFIG } from '../utils/constants';
import KanbanView from './KanbanView';

export const KanbanApp = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const numericIds = INITIAL_TASKS.map((t) => parseInt(t.id, 10)).filter(Boolean);
  const initialLastId = numericIds.length ? Math.max(...numericIds) : 0;
  const [lastId, setLastId] = useState(initialLastId);
  const [assignedIds, setAssignedIds] = useState(numericIds);

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
    setTasks((prev) => [...prev, newTask]);
    setLastId(nextId);
    setAssignedIds((prev) => [...prev, nextId]);
  };

  const handleDeleteTask = (id) => {
    const idNum = parseInt(id, 10);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setAssignedIds((prev) => prev.filter((n) => n !== idNum));
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
