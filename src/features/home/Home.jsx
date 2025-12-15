import React, { useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoards, createBoard, deleteBoardAsync } from '../../store/kanbanSlice';
import styles from './Home.module.css';

import LoginView from './components/LoginView';
import CreateBoard from './components/CreateBoard';
import BoardItem from './components/BoardItem';

const makeBoardKey = (name) => {
  if (!name) return `B${Date.now()}`;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchBoards());
  }, [isAuthenticated]);

  const handleCreateBoard = (boardName) => {
    const key = makeBoardKey(boardName) + Math.floor(Math.random() * 90 + 10);
    dispatch(createBoard({ name: boardName, key }));
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