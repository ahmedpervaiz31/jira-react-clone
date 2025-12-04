import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_TASKS } from './utils/constants';

const initialState = {
  tasks: [], // will be hydrated by redux-persist
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
  },
});

export const { addTask, deleteTask, setTasks, updateTasksOrder } = kanbanSlice.actions;
export default kanbanSlice.reducer;
