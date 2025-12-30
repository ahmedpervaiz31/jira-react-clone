import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import api from '../utils/api';

const initialState = {
  boards: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  total: 0,
};

export const fetchBoards = createAsyncThunk('board/fetchBoards', async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/boards', { params: { page, limit } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createBoard = createAsyncThunk('board/createBoard', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/boards', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteBoardAsync = createAsyncThunk('board/deleteBoard', async (boardId, { rejectWithValue }) => {
  try {
    await api.delete(`/boards/${boardId}`);
    return boardId;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        const { items, total, page, hasMore } = action.payload || {};
        const mappedBoards = (items || []).map((b) => ({
          id: b._id || b.id,
          name: b.name,
          key: b.key,
        }));
        if (page && page > 1) {
          state.boards = [...state.boards, ...mappedBoards];
        } else {
          state.boards = mappedBoards;
        }
        state.page = page || 1;
        state.hasMore = hasMore !== undefined ? hasMore : true;
        state.total = total || 0;
      })
      .addCase(fetchBoards.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBoard.fulfilled, (state, action) => {
        const b = action.payload;
        state.boards.push({ id: b._id || b.id, name: b.name, key: b.key });
      })
      .addCase(deleteBoardAsync.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
      });
  },
});

const selectBoardState = (state) => state.board;
export const selectBoards = createSelector(
  [selectBoardState],
  (board) => board?.boards || []
);

export const selectBoardPage = (state) => (state.board && typeof state.board.page === 'number') ? state.board.page : 1;
export const selectBoardHasMore = (state) => (state.board && typeof state.board.hasMore === 'boolean') ? state.board.hasMore : true;
export const selectBoardLoading = (state) => (state.board && typeof state.board.loading === 'boolean') ? state.board.loading : false;
export const selectBoardTotal = (state) => (state.board && typeof state.board.total === 'number') ? state.board.total : 0;
export default boardSlice.reducer;
