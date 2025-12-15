import React from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, addBoard, deleteBoard } from '../../store/kanbanSlice';
import styles from './Home.module.css';

import LoginView from './components/LoginView';
import CreateBoard from './components/CreateBoard';
import BoardItem from './components/BoardItem';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch(); 

const handleCreateBoard = (boardName) => {
  const maxId = boards.reduce((max, board) => {
    const idNum = parseInt(board.id.replace('board', ''), 10);
    return isNaN(idNum) ? max : Math.max(max, idNum);
  }, 0);

  const nextId = maxId + 1;
  const newBoardId = `board${nextId}`;

  dispatch(addBoard({ id: newBoardId, name: boardName }));
};

  const handleDeleteBoard = (e, boardId) => {
    e.preventDefault();
    dispatch(deleteBoard({ boardId }));
  };

  return (
    <div className={styles.container}>
      {!isAuthenticated ? (
        <LoginView />
      ) : (
        <>
          <h1 className={styles.heading}>Welcome, {user?.username || 'User'}!</h1>
          
          <CreateBoard onCreate={handleCreateBoard} />

          <div className={styles.boards}>
            {boards.map(board => (
              <BoardItem 
                key={board.id} 
                board={board} 
                onDelete={handleDeleteBoard} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;