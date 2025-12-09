
import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_BOARDS } from '../features/kanban/utils/constants';

const initialState = {
  boards: INITIAL_BOARDS, 
};


const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { boardId, task } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.tasks.push(task);
      }
    },
    deleteTask: (state, action) => {
      const { boardId, taskId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.tasks = board.tasks.filter((t) => t.id !== taskId);
      }
    },
    setTasks: (state, action) => {
      const { boardId, tasks } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.tasks = tasks;
      }
    },
    moveTask: (state, action) => {
      const { boardId, tasks } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.tasks = tasks;
      }
    },
    addBoard: (state, action) => {
      const { id, name } = action.payload; 
      const newBoard = {
        id: id,           
        name: name || 'Untitled Board',
        tasks: [],
      };
      state.boards.push(newBoard);
    },
    deleteBoard: (state, action) => {
      const { boardId } = action.payload;
      state.boards = state.boards.filter(b => b.id !== boardId);
    },
  },
});


export const { 
    addTask, 
    deleteTask, 
    setTasks, 
    moveTask, 
    addBoard,  
    deleteBoard 
} = kanbanSlice.actions;

export const selectBoardById = (state, boardId) => 
    state.kanban.boards.find(b => b.id === boardId);

export const selectBoards = (state) => state.kanban.boards;

export default kanbanSlice.reducer;
