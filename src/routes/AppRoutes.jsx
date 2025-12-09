import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../features/home/Home';
import KanbanApp from '../features/kanban/UI/KanbanApp';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/kanban/:kanbanId" element={<KanbanApp />} />
    </Routes>
  );
};

export default AppRoutes;