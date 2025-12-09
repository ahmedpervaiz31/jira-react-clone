import React, { useState } from 'react';
import { Button } from 'antd';
import LoginModal from '../../auth/components/LoginModal.jsx'
import styles from '../Home.module.css'; 

const LoginView = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <>
      <h1 className={styles.heading}>Log in to Jira Kanban</h1>
      <Button type="primary" size="large" onClick={() => setLoginVisible(true)}>
        Log In
      </Button>
      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </>
  );
};

export default LoginView;