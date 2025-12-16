import React, { useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoards, createBoard, deleteBoardAsync } from '../../store/kanbanSlice';
import styles from './Home.module.css';

import LoginView from './components/LoginView';
import CreateBoard from './components/CreateBoard';
import BoardItem from './components/BoardItem';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchBoards());
  }, [isAuthenticated]);

  const handleCreateBoard = (boardName) => {
    dispatch(createBoard({ name: boardName}));
  };

  const handleDeleteBoard = (e, boardId) => {
    e.preventDefault();
    dispatch(deleteBoardAsync(boardId));
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