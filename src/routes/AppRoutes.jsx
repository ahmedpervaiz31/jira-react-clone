import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../features/home/Home';
import KanbanApp from '../features/kanban/UI/KanbanApp';
import TaskPage from '../features/tasksearch/components/TaskPage';
import NotFound from '../components/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/kanban/:kanbanId" element={<KanbanApp />} />
      <Route path="/tasks/:taskId" element={<TaskPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;