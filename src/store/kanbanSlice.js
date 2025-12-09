
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
    // to do: add reducer for board adding/deleting
  },
});


export const { addTask, deleteTask, setTasks, moveTask } = kanbanSlice.actions;

export const selectBoardById = (state, boardId) => 
    state.kanban.boards.find(b => b.id === boardId);

export const selectBoards = (state) => state.kanban.boards;

export default kanbanSlice.reducer;
