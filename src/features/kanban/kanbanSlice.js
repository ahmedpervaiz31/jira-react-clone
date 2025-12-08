import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_TASKS } from './utils/constants';

const initialState = {
  tasks: INITIAL_TASKS, // Initial tasks, will be hydrated by redux-persist if present
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    // to be used for dnd
    updateTasksOrder: (state, action) => {
      state.tasks = action.payload;
    },
    moveTask: (state, action) => {
      state.tasks = action.payload.tasks;
    },
  },
});

export const { addTask, deleteTask, setTasks, updateTasksOrder, moveTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
