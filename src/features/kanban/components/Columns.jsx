import React from 'react';
import { TaskCard } from './TaskCard';
import { CreateCard } from './CreateCard';

export const BoardColumn = ({ title, status, tasks, onAddTask }) => {
  return (
    <div style={{
      flex: 1,
      border: '2px solid black',
      padding: '10px',
      margin: '0 5px',
      backgroundColor: '#f4f4f4',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginTop: 0 }}>
        {title} ({tasks.length})
      </h3>
      
      <div style={{ flex: 1 }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <CreateCard onAdd={(title) => onAddTask(title, status)} />
    </div>
  );
};