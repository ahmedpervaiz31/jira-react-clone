export const COLUMN_TYPES = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};


export const APP_ROUTES = {
  HOME: '/',
  KANBAN_BOARD: '/kanban', 
};

export const migrateTasksOrder = (tasks) => {
  if (!tasks || tasks.length === 0) return tasks;
  
  const tasksByStatus = {};
  tasks.forEach(task => {
    if (!tasksByStatus[task.status]) {
      tasksByStatus[task.status] = [];
    }
    tasksByStatus[task.status].push(task);
  });
  
  return tasks.map(task => {
    if (task.order !== undefined && task.order !== null) {
      return task;
    }
    
    const sameStatusTasks = tasksByStatus[task.status] || [];
    const sortedTasks = sameStatusTasks.sort((a, b) => {
      if (a.order !== undefined && b.order === undefined) return -1;
      if (a.order === undefined && b.order !== undefined) return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    
    const index = sortedTasks.findIndex(t => t.id === task.id);
    return {
      ...task,
      order: index >= 0 ? index : 0
    };
  });
};

export const COLUMNS_CONFIG = [
  { id: COLUMN_TYPES.TODO, title: 'To Do' },
  { id: COLUMN_TYPES.IN_PROGRESS, title: 'In Progress' },
  { id: COLUMN_TYPES.DONE, title: 'Done' },
];