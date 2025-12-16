
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  boards: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk('kanban/fetchBoards', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/boards');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createBoard = createAsyncThunk('kanban/createBoard', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/boards', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteBoardAsync = createAsyncThunk('kanban/deleteBoard', async (boardId, { rejectWithValue }) => {
  try {
    await api.delete(`/boards/${boardId}`);
    return boardId;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createTask = createAsyncThunk('kanban/createTask', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteTaskAsync = createAsyncThunk('kanban/deleteTask', async ({ taskId }, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const moveTaskAsync = createAsyncThunk('kanban/moveTask', async ({ taskId, status, order }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${taskId}`, { status, order });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // local-only reducers for optimistic updates
    addTaskLocal: (state, action) => {
      const { boardId, task } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) board.tasks.push(task);
    },
    setTasksLocal: (state, action) => {
      const { boardId, tasks } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) board.tasks = tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        // map backend boards/tasks to frontend shape (use id property used by UI)
        state.boards = (action.payload || []).map((b) => ({
          id: b._id || b.id,
          name: b.name,
          key: b.key,
          tasks: (b.tasks || []).map((t) => ({
            id: t._id || t.id,
            title: t.title,
            status: t.status,
            assignedTo: t.assignedTo,
            description: t.description,
            dueDate: t.dueDate,
            createdAt: t.createdAt,
            order: t.order,
            displayId: t.displayId,
          })),
        }));
      })
      .addCase(fetchBoards.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createBoard.fulfilled, (state, action) => {
        const b = action.payload;
        state.boards.push({ id: b._id || b.id, name: b.name, key: b.key, tasks: [] });
      })

      .addCase(deleteBoardAsync.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
      })

      .addCase(createTask.fulfilled, (state, action) => {
        const t = action.payload;
        const board = state.boards.find((b) => b.id === (t.boardId || t.board || t.boardId));
        const mapped = {
          id: t._id || t.id,
          title: t.title,
          status: t.status,
          assignedTo: t.assignedTo,
          description: t.description,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
          order: t.order,
          displayId: t.displayId,
        };
        if (board) board.tasks.push(mapped);
      })

      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.boards.forEach((b) => {
          b.tasks = b.tasks.filter((t) => t.id !== taskId);
        });
      })

      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        const t = action.payload;
        // update task in whichever board contains it
        state.boards.forEach((b) => {
          const idx = b.tasks.findIndex((x) => x.id === (t._id || t.id));
          if (idx >= 0) {
            b.tasks[idx] = { ...b.tasks[idx], status: t.status, order: t.order };
          }
        });
      });
  },
});

export const { addTaskLocal, setTasksLocal } = kanbanSlice.actions;

export const selectBoardById = (state, boardId) => state.kanban.boards.find((b) => b.id === boardId);
export const selectBoards = (state) => state.kanban.boards;
export const selectAllTasksFlattened = (state) =>
  state.kanban.boards.flatMap((b) =>
    (b.tasks || []).map((t) => ({ ...t, boardId: b.id, boardKey: b.key, boardName: b.name }))
  );

export default kanbanSlice.reducer;
