export const COLUMN_TYPES = {
  TODO: 'to_do',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const APP_ROUTES = {
  HOME: '/',
  KANBAN_BOARD: '/kanban', 
};

export const COLUMNS_CONFIG = [
  { id: COLUMN_TYPES.TODO, title: 'To Do' },
  { id: COLUMN_TYPES.IN_PROGRESS, title: 'In Progress' },
  { id: COLUMN_TYPES.DONE, title: 'Done' },
];

export const DELETE_MODAL = {
  TITLE: 'Delete?',
  CONTENT: 'This action cannot be undone.',
  OK_TEXT: 'Delete',
};

export const NOT_FOUND = {
  TITLE: '404 - Page Not Found',
  CONTENT: 'The page you are looking for does not exist.',
};

export const AUTH_LABELS = {
  LOGIN_HEADING: 'Log in to Jira Kanban',
};