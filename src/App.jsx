import React, { useEffect } from 'react';
import Navbar from './components/Navbar';

import { Layout } from 'antd';
import { useTheme } from './store/hooks';
import styles from './App.module.css';
import AppRoutes from './routes/AppRoutes.jsx';

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

  return (
    <Layout className={styles.layout}>
      <Navbar />
      <Content className={styles.content}>
        <AppRoutes />
      </Content>
    </Layout>
  );
}