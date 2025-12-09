export const COLUMN_TYPES = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Set up repo',
    status: COLUMN_TYPES.TODO,
    assignedTo: 'Person A',
    createdAt: '2025-11-20T09:15:00.000Z',
    dueDate: null,
    description: '<p>A</p>',
    order: 0
  },
  {
    id: '2',
    title: 'Install dependencies',
    status: COLUMN_TYPES.TODO,
    assignedTo: 'Person B',
    createdAt: '2025-11-20T10:00:00.000Z',
    dueDate: null,
    description: '<p>B</p>',
    order: 1
  },
  {
    id: '3',
    title: 'Design database schema',
    status: COLUMN_TYPES.IN_PROGRESS,
    assignedTo: 'Person C',
    createdAt: '2025-11-21T14:30:00.000Z',
    dueDate: '2025-11-30',
    description: '<p>C</p>',
    order: 0
  },
  {
    id: '4',
    title: 'Configure Webpack',
    status: COLUMN_TYPES.IN_PROGRESS,
    assignedTo: 'Person D',
    createdAt: '2025-11-22T09:00:00.000Z',
    dueDate: null,
    description: '<p>D</p>',
    order: 1
  },
  {
    id: '5',
    title: 'Drink coffee',
    status: COLUMN_TYPES.DONE,
    assignedTo: 'Person E',
    createdAt: '2025-11-19T08:00:00.000Z',
    dueDate: null,
    description: '<p>E</p>',
    order: 0
  },
];

export const migrateTasksOrder = (tasks) => {
  if (!tasks || tasks.length === 0) return tasks;
  
  // Group tasks by status
  const tasksByStatus = {};
  tasks.forEach(task => {
    if (!tasksByStatus[task.status]) {
      tasksByStatus[task.status] = [];
    }
    tasksByStatus[task.status].push(task);
  });
  
  // Add order field to tasks that don't have it
  return tasks.map(task => {
    if (task.order !== undefined && task.order !== null) {
      return task;
    }
    
    // Find tasks in same status group and assign order based on creation time or position
    const sameStatusTasks = tasksByStatus[task.status] || [];
    const sortedTasks = sameStatusTasks.sort((a, b) => {
      // First, tasks with order come first
      if (a.order !== undefined && b.order === undefined) return -1;
      if (a.order === undefined && b.order !== undefined) return 1;
      // If both have or don't have order, sort by createdAt
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