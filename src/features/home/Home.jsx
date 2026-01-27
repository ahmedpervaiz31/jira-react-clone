import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoards, createBoard, deleteBoardAsync, selectBoardTotal } from '../../store/boardSlice';
import { useBoardPagination } from './hooks/useBoardPagination';
import styles from './Home.module.css';
import ChatBot from '../../components/chatbot/ChatBot';
import { socket } from '../../utils/socket';
import ForceRefreshModal from '../../components/ForceRefreshModal';
import LoginView from './components/LoginView';
import CreateBoard from './components/CreateBoard';
import BoardItem from './components/BoardItem';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();
  const total = useSelector(selectBoardTotal);
  const { lastBoardRef, page, hasMore, loading } = useBoardPagination();

  const [forceRefresh, setForceRefresh] = useState({ visible: false, reason: '' });

  useEffect(() => {
    function handleBoardEvent({ userId }) {
      if (userId && user?.id && userId !== user.id) {
        setForceRefresh({ visible: true, reason: '' });
      }
    }
    function handleBoardDeleted({ userId }) {
      if (userId && user?.id && userId !== user.id) {
        setForceRefresh({ visible: true, reason: 'A board was deleted. Please refresh.' });
      }
    }
    socket.on('board:created', handleBoardEvent);
    socket.on('board:deleted', handleBoardDeleted);
    return () => {
      socket.off('board:created', handleBoardEvent);
      socket.off('board:deleted', handleBoardDeleted);
    };
  }, [user?.id]);

  const handleCreateBoard = (boardData) => {
    dispatch(createBoard(boardData));
  };

  const handleDeleteBoard = (boardId) => {
    dispatch(deleteBoardAsync(boardId));
  };

  return (
    <div className={styles.container}>
      <ForceRefreshModal visible={forceRefresh.visible} reason={forceRefresh.reason} />
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
      {isAuthenticated && <ChatBot />}
    </div>
  );
};

export default Home;