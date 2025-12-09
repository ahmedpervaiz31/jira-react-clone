export const COLUMN_TYPES = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const INITIAL_BOARDS = [
  {
    id: 'board1',
    name: 'Frontend Tasks',
    tasks: [
      {
        id: '1',
        title: 'Set up repo',
        status: COLUMN_TYPES.TODO,
        assignedTo: 'Person A',
        createdAt: '2025-11-20T09:15:00.000Z',
        dueDate: null,
        description: '<p>Set up the frontend repository</p>',
        order: 0
      },
      {
        id: '2',
        title: 'Install dependencies',
        status: COLUMN_TYPES.TODO,
        assignedTo: 'Person B',
        createdAt: '2025-11-20T10:00:00.000Z',
        dueDate: null,
        description: '<p>Install React, Redux, etc.</p>',
        order: 1
      },
      {
        id: '3',
        title: 'Create UI mockups',
        status: COLUMN_TYPES.IN_PROGRESS,
        assignedTo: 'Person C',
        createdAt: '2025-11-21T14:30:00.000Z',
        dueDate: '2025-11-30',
        description: '<p>Design the main screens</p>',
        order: 0
      }
    ]
  },
  {
    id: 'board2',
    name: 'Backend Tasks',
    tasks: [
      {
        id: '1',
        title: 'Set up backend repo',
        status: COLUMN_TYPES.TODO,
        assignedTo: 'Person X',
        createdAt: '2025-11-20T09:15:00.000Z',
        dueDate: null,
        description: '<p>Set up the backend repository</p>',
        order: 0
      },
      {
        id: '2',
        title: 'Design database schema',
        status: COLUMN_TYPES.IN_PROGRESS,
        assignedTo: 'Person Y',
        createdAt: '2025-11-21T14:30:00.000Z',
        dueDate: '2025-11-30',
        description: '<p>Design DB for users and tasks</p>',
        order: 0
      },
      {
        id: '3',
        title: 'Implement API',
        status: COLUMN_TYPES.DONE,
        assignedTo: 'Person Z',
        createdAt: '2025-11-22T09:00:00.000Z',
        dueDate: null,
        description: '<p>REST API for tasks</p>',
        order: 0
      }
    ]
  },
  {
    id: 'board3',
    name: 'DevOps Tasks',
    tasks: [
      {
        id: '1',
        title: 'Set up CI/CD',
        status: COLUMN_TYPES.TODO,
        assignedTo: 'DevOps A',
        createdAt: '2025-11-20T09:15:00.000Z',
        dueDate: null,
        description: '<p>Configure GitHub Actions</p>',
        order: 0
      },
      {
        id: '2',
        title: 'Write deployment scripts',
        status: COLUMN_TYPES.IN_PROGRESS,
        assignedTo: 'DevOps B',
        createdAt: '2025-11-21T14:30:00.000Z',
        dueDate: '2025-11-30',
        description: '<p>Automate deployment</p>',
        order: 0
      },
      {
        id: '3',
        title: 'Monitor production',
        status: COLUMN_TYPES.DONE,
        assignedTo: 'DevOps C',
        createdAt: '2025-11-22T09:00:00.000Z',
        dueDate: null,
        description: '<p>Set up monitoring tools</p>',
        order: 0
      }
    ]
  }
];

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