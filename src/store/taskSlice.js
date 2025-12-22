import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  tasksByBoard: {},
  loading: false,
  error: null,
  tasksPage: {},
  tasksHasMore: {}, 
  tasksTotal: {}, 
};

export const getTasksByAssigneeAsync = createAsyncThunk('tasks/getTasksByAssignee', 
    async ({ assignee, boardId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const res = await api.get('/tasks', { params: { assignedTo: assignee, boardId, page, limit } });
      return { ...res.data, boardId, assignee };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', 
    async ({ boardId, status, page = 1, limit = 20 }, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks', { params: { boardId, status, page, limit } });
    return { ...res.data, boardId, status };
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async ({ taskId }, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const moveTaskAsync = createAsyncThunk('tasks/moveTask', async ({ taskId, status, order }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${taskId}`, { status, order });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLocal: (state, action) => {
      const { boardId, tasks } = action.payload;
      state.tasksByBoard[boardId] = tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksByAssigneeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksByAssigneeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { items, total, page, hasMore, boardId, assignee } = action.payload || {};
        if (!state.tasksByBoard[boardId]) state.tasksByBoard[boardId] = [];
        const mappedTasks = (items || []).map((t) => ({
          id: t._id || t.id,
          title: t.title,
          status: t.status,
          assignedTo: t.assignedTo,
          description: t.description,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
          order: t.order,
          displayId: t.displayId,
        }));
        state.tasksByBoard[boardId] = [
          ...state.tasksByBoard[boardId].filter((t) => t.assignedTo !== assignee),
          ...mappedTasks
        ];
      })
      .addCase(getTasksByAssigneeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const { items, total, page, hasMore, boardId, status } = action.payload || {};

        if (!state.tasksByBoard[boardId]) state.tasksByBoard[boardId] = [];
        const mappedTasks = (items || []).map((t) => ({
          id: t._id || t.id,
          title: t.title,
          status: t.status,
          assignedTo: t.assignedTo,
          description: t.description,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
          order: t.order,
          displayId: t.displayId,
        }));

        if (!state.tasksPage[boardId]) 
            state.tasksPage[boardId] = {};
        if (!state.tasksHasMore[boardId]) 
            state.tasksHasMore[boardId] = {};
        if (!state.tasksTotal[boardId]) 
            state.tasksTotal[boardId] = {};
        if (page && page > 1) {
          state.tasksByBoard[boardId] = [
            ...state.tasksByBoard[boardId].filter((t) => t.status !== status),
            ...mappedTasks
          ];
        } else {
          state.tasksByBoard[boardId] = [
            ...state.tasksByBoard[boardId].filter((t) => t.status !== status),
            ...mappedTasks
          ];
        }
        state.tasksPage[boardId][status] = page || 1;
        state.tasksHasMore[boardId][status] = hasMore !== undefined ? hasMore : true;
        state.tasksTotal[boardId][status] = total || 0;
      })
      .addCase(fetchTasks.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
    })
      .addCase(createTask.fulfilled, (state, action) => {
        const t = action.payload;
        const boardId = t.boardId || t.board || t.boardId;
        if (!state.tasksByBoard[boardId]) state.tasksByBoard[boardId] = [];
        state.tasksByBoard[boardId].push({
          id: t._id || t.id,
          title: t.title,
          status: t.status,
          assignedTo: t.assignedTo,
          description: t.description,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
          order: t.order,
          displayId: t.displayId,
        });
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const taskId = action.payload;
        Object.keys(state.tasksByBoard).forEach((boardId) => {
          state.tasksByBoard[boardId] = state.tasksByBoard[boardId].filter((t) => t.id !== taskId);
        });
      })
      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        const t = action.payload;
        const boardId = t.boardId || t.board || t.boardId;
        if (!state.tasksByBoard[boardId]) return;
        const idx = state.tasksByBoard[boardId].findIndex((x) => x.id === (t._id || t.id));
        if (idx >= 0) {
          state.tasksByBoard[boardId][idx] = { ...state.tasksByBoard[boardId][idx], status: t.status, order: t.order };
        }
      });
  },
});

const EMPTY_TASKS = [];

export const { setTasksLocal } = taskSlice.actions;
export const selectTasksByBoard = (state, boardId) => state.tasks.tasksByBoard[boardId] || EMPTY_TASKS;
export default taskSlice.reducer;
