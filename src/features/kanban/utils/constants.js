export const COLUMN_TYPES = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

/**
 * Initial set of mock tasks.
 * @type {import('../../../lib/types').Task[]}
 */
export const INITIAL_TASKS = [
  { id: '1', title: 'Set up repo', status: COLUMN_TYPES.TODO },
  { id: '2', title: 'Install dependencies', status: COLUMN_TYPES.TODO },
  { id: '3', title: 'Design database schema', status: COLUMN_TYPES.IN_PROGRESS },
  { id: '4', title: 'Configure Webpack', status: COLUMN_TYPES.IN_PROGRESS },
  { id: '5', title: 'Drink coffee', status: COLUMN_TYPES.DONE },
];

/**
 * Configuration for the board columns.
 * @type {import('../../../lib/types').ColumnConfig[]}
 */
export const COLUMNS_CONFIG = [
  { id: COLUMN_TYPES.TODO, title: 'To Do' },
  { id: COLUMN_TYPES.IN_PROGRESS, title: 'In Progress' },
  { id: COLUMN_TYPES.DONE, title: 'Done' },
];