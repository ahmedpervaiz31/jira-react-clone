import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { logOut } from '../features/auth/authSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../store/hooks';
import LoginModal from '../features/auth/components/LoginModal';
import styles from './NavBar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
    console.log("logged out");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <span className={styles.brandText}>Jira</span>
        </div>

        <div className={styles.links}>
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
