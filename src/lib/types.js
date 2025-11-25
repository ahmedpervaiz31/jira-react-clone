/**
 * @typedef {'to_do' | 'in_progress' | 'done'} TaskStatus
 */

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} title
 * @property {TaskStatus} status
 */

/**
 * @typedef {object} ColumnConfig
 * @property {TaskStatus} id
 * @property {string} title
 */

// Note: In a full TS setup, this would be a .ts or .tsx file.
// We keep it as .js here for simplicity, relying on JSDoc.