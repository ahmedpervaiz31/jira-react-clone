import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { logOut } from '../features/auth/authSlice';
import { useAuth } from '../features/auth/hooks/useAuth';
import LoginModal from '../features/auth/components/LoginModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
    console.log("logged out");
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.brand}>
          <span style={styles.brandText}>Jira</span>
        </div>

        <div style={styles.links}>
          {isAuthenticated && (
            <>
              <span style={styles.greeting}>Welcome {user.username}!</span>
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

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#0052cc',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  brand: {
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  brandText: {
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  greeting: {
    fontSize: '0.95em',
    fontWeight: '500',
  },
};

export default Navbar;
