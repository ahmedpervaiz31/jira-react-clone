import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { UserOutlined, LoginOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { logOut } from '../store/authSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import { fetchBoards } from '../store/boardSlice';

import LoginModal from '../features/auth/components/LoginModal';
import TaskSearch from '../features/tasksearch/TaskSearch';
import SearchModal from './SearchModal';
import SideBar from './SideBar';

import styles from './NavBar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logOut());
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchBoards());
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.leftGroup}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarVisible(true)}
            aria-label="Open sidebar"
          >
            <MenuOutlined />
          </button>
          
          <Link to="/" className={styles.brandText}>Jira</Link>
        </div>

        <div className={styles.centerGroup}>
          {isAuthenticated && (
            <div className={styles.searchWrapperCentered}>
              <TaskSearch />
            </div>
          )}
        </div>

        <div className={styles.rightGroup}>
          { isAuthenticated &&
            <button
              className={styles.searchIconBtn}
              onClick={() => setSearchModalVisible(true)}
              aria-label="Open search"
            >
              <SearchOutlined />
            </button>
          }

          {isAuthenticated ? (
            <Button
              className={styles.authButton}
              type="secondary"
              danger
              icon={<UserOutlined />}
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
          ) : (
            <Button
              className={styles.authButton}
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
            >
              Login
            </Button>
          )}
        </div>
      </nav>

      <SideBar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onLoginClick={() => setLoginModalVisible(true)}
        onLogout={handleLogout}
      />

      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
      />

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
};

export default Navbar;