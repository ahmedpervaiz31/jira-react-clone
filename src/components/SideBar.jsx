import React from 'react';
import { Drawer, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../store/hooks';
import { Link } from 'react-router-dom';
import styles from './SideBar.module.css';


const SideBar = ({ visible, onClose, onLoginClick, onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();

  const footer = (
    <div className={styles.sidebarFooter}>
      <Button
        className={styles.menuItem}
        onClick={toggle}
        block
      >
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </Button>
      {isAuthenticated ? (
        <Button
          className={styles.menuItem}
          onClick={() => { onLogout && onLogout(); onClose(); }}
          block
          danger
        >
          Log Out
        </Button>
      ) : (
        <Button
          className={styles.menuItem}
          onClick={() => { onLoginClick && onLoginClick(); onClose(); }}
          block
          type="primary"
        >
          Login
        </Button>
      )}
    </div>
  );

  return (
    <Drawer
      title={
        <div className={styles.sidebarHeader}>
          <Link to="/profile" className={styles.menuItem} onClick={onClose}>
            {isAuthenticated &&
            <>
              <Avatar icon={<UserOutlined />} />
              <span className={styles.username}>{user.username}</span>
            </>
            }
          </Link>
        </div>
      }
      placement="left"
      closable={true}
      onClose={onClose}
      open={visible}
      width={240}
      className={styles.sidebar}
      footer={footer}
      footerStyle={{ padding: 0, background: 'inherit' }}
    >
      <div className={styles.menuSection}>
        <Link to="/" className={styles.menuItem} onClick={onClose}>
          Home
        </Link>
        { isAuthenticated && <>
            <Link to="/kanban" className={styles.menuItem} onClick={onClose}>
                Boards
            </Link>
            <Link to="/tasks" className={styles.menuItem} onClick={onClose}>
                Tasks
            </Link>
            <Link to="/settings" className={styles.menuItem} onClick={onClose}>
                Settings
            </Link>
        </> }
      </div>
    </Drawer>
  );
};

export default SideBar;
