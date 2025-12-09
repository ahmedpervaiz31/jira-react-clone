import React, { useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/kanbanSlice';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import LoginModal from '../auth/components/LoginModal';
import styles from './Home.module.css';

const Home = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const boards = useSelector(selectBoards);

  return (
    <div className={styles.container}>
      {!isAuthenticated ? (
        <>
          <h1 className={styles.heading}>Log in to Jira Kanban</h1>
          <Button type="primary" size="large" onClick={() => setLoginVisible(true)}>
            Log In
          </Button>
          <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
        </>
      ) : (
        <>
          <h1 className={styles.heading}>Welcome, {user?.username || 'User'}!</h1>
          <div className={styles.boards}>
            {boards.map(board => (
              <Button key={board.id} type="primary" size="large" block className={styles.boardButton}>
                <Link className={styles.link} to={`/kanban/${board.id}`}>{board.name}</Link>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
