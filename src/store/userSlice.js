import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  searchResults: [],
  loading: false,
  error: null,
};

export const searchUsersAsync = createAsyncThunk(
  'users/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/search', { params: { q: query } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const selectUserSearchResults = (state) => state.users.searchResults;
export const selectUserSearchLoading = (state) => state.users.loading;
export const selectUserSearchError = (state) => state.users.error;
