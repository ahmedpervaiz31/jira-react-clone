import React, { useState } from 'react';
import { BoardColumn } from './components/Columns';
import { INITIAL_TASKS, COLUMNS_CONFIG } from './utils/constants';

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleAddTask = (title, status) => {
    const newTask = {
      id: Math.floor(Math.random() * 10000).toString(), 
      title,
      status
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>PROTOTYPE JIRA - PHASE 1</h1>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {COLUMNS_CONFIG.map(col => (
          <BoardColumn 
            key={col.id}
            title={col.title}
            status={col.id}
            tasks={tasks.filter(t => t.status === col.id)}
            onAddTask={handleAddTask}
          />
        ))}
      </div>
    </div>
  );
};