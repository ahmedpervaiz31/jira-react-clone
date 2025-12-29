import React, { useState } from 'react';
import { Button } from 'antd';
import LoginModal from '../../auth/components/LoginModal.jsx'
import styles from '../Home.module.css'; 
import { AUTH_LABELS } from '../../../utils/constants';

const LoginView = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <>
      <h1 className={styles.heading}>{AUTH_LABELS.LOGIN_HEADING}</h1>
      <Button type="primary" size="large" className={styles.Btn} onClick={() => setLoginVisible(true)}>
        Log In
      </Button>
      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </>
  );
};

export default LoginView;