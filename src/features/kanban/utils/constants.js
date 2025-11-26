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
    description: '<p>A</p>'
  },
  {
    id: '2',
    title: 'Install dependencies',
    status: COLUMN_TYPES.TODO,
    assignedTo: 'Person B',
    createdAt: '2025-11-20T10:00:00.000Z',
    dueDate: null,
    description: '<p>B</p>'
  },
  {
    id: '3',
    title: 'Design database schema',
    status: COLUMN_TYPES.IN_PROGRESS,
    assignedTo: 'Person C',
    createdAt: '2025-11-21T14:30:00.000Z',
    dueDate: '2025-11-30',
    description: '<p>C</p>'
  },
  {
    id: '4',
    title: 'Configure Webpack',
    status: COLUMN_TYPES.IN_PROGRESS,
    assignedTo: 'Person D',
    createdAt: '2025-11-22T09:00:00.000Z',
    dueDate: null,
    description: '<p>D</p>'
  },
  {
    id: '5',
    title: 'Drink coffee',
    status: COLUMN_TYPES.DONE,
    assignedTo: 'Person E',
    createdAt: '2025-11-19T08:00:00.000Z',
    dueDate: null,
    description: '<p>E</p>'
  },
];

export const COLUMNS_CONFIG = [
  { id: COLUMN_TYPES.TODO, title: 'To Do' },
  { id: COLUMN_TYPES.IN_PROGRESS, title: 'In Progress' },
  { id: COLUMN_TYPES.DONE, title: 'Done' },
];