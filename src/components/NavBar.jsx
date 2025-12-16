import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { logOut } from '../store/authSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../store/hooks';
import LoginModal from '../features/auth/components/LoginModal';
import TaskSearch from '../features/tasksearch/TaskSearch'
import { fetchBoards } from '../store/kanbanSlice';
import styles from './NavBar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logOut());
    console.log('logged out');
    navigate('/');
  };

  React.useEffect(() => {
    if (isAuthenticated) dispatch(fetchBoards());
  }, [isAuthenticated]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandText}>Jira</Link>
        </div>

        <div className={styles.links}>
          {isAuthenticated && (
            <div className={styles.searchWrapper}>
              <TaskSearch />
            </div>
          )}
          <button 
            className={styles.themeToggle}
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </button>
          {isAuthenticated && (
            <>
              <span className={styles.greeting}>Welcome {user.username}!</span>
              <Button 
                type="primary" 
                danger 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          )} 
          {!isAuthenticated && (
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
            >
              Login
            </Button>
          )}
        </div>
      </nav>
      
      <LoginModal 
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
};

export default Navbar;
