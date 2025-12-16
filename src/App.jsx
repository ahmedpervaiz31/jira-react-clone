import React, { useEffect } from 'react';
import Navbar from './components/Navbar';

import { Layout } from 'antd';
import { useTheme } from './store/hooks';
import styles from './App.module.css';
import AppRoutes from './routes/AppRoutes.jsx';
import { useDispatch } from 'react-redux';
import api from './utils/api';
import { setCred, logOut } from './store/authSlice';

const { Content } = Layout;

export default function App() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDark]);

  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth from token on app start
    const token = localStorage.getItem('token');
    if (token) {
      (async () => {
        try {
          const res = await api.get('/auth/me');
          const user = res.data?.user;
          if (user) {
            dispatch(setCred({ id: user.id || user._id, username: user.username }));
          } else {
            localStorage.removeItem('token');
            dispatch(logOut());
          }
        } catch (err) {
          localStorage.removeItem('token');
          dispatch(logOut());
        }
      })();
    }
  }, []);

  return (
    <Layout className={styles.layout}>
      <Navbar />
      <Content className={styles.content}>
        <AppRoutes />
      </Content>
    </Layout>
  );
}