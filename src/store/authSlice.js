import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,          
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCred: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCred, logOut } = authSlice.actions;

export default authSlice.reducer;
