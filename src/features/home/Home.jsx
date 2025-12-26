import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoards, createBoard, deleteBoardAsync, selectBoardPage, selectBoardHasMore, selectBoardLoading, selectBoardTotal } from '../../store/boardSlice';
import styles from './Home.module.css';

import LoginView from './components/LoginView';
import CreateBoard from './components/CreateBoard';
import BoardItem from './components/BoardItem';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();

  //define page and hasMore for pagination 
  const page = useSelector(selectBoardPage);
  const hasMore = useSelector(selectBoardHasMore);
  const loading = useSelector(selectBoardLoading);
  const total = useSelector(selectBoardTotal);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchBoards({ page: 1 }));
  }, [isAuthenticated, dispatch]);

  const observer = useRef();
  const lastBoardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchBoards({ page: page + 1 }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  const handleCreateBoard = (boardName) => {
    dispatch(createBoard({ name: boardName }));
  };

  const handleDeleteBoard = (boardId) => {
    dispatch(deleteBoardAsync(boardId));
  };

  return (
    <div className={styles.container}>
      {!isAuthenticated ? (
        <LoginView />
      ) : (
        <>
          <h1 className={styles.heading}>Welcome, {user?.username || 'User'}!</h1>
          <div className={styles.inputContainer}>
            <CreateBoard onCreate={handleCreateBoard} />
          </div>
          <div className={styles.boards}>
            {boards.map((board, idx) => {
              if (boards.length === idx + 1) {
                return (
                  <div ref={lastBoardRef} key={board.id}>
                    <BoardItem board={board} onDelete={handleDeleteBoard} />
                  </div>
                );
              } else {
                return (
                  <BoardItem key={board.id} board={board} onDelete={handleDeleteBoard} />
                );
              }
            })}
          </div>
          {loading && <div className={styles.loading}>Loading...</div>}

          <div className={styles.paginationContainer}>
            <span className={styles.displayCount}>{`${boards.length} out of ${typeof total === 'number' ? total : boards.length} displayed`}</span>
            {hasMore ? (
              <button
                className={styles.loadMoreBtn}
                disabled={!!loading}
                onClick={() => dispatch(fetchBoards({ page: page + 1 }))}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;