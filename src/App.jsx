import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanApp from './features/kanban/UI/KanbanApp.jsx';
import Home from './features/home/Home.jsx';

import { Layout } from 'antd';
import { useTheme } from './store/hooks';
import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/kanban/:kanbanId" element={<KanbanApp />} />
        </Routes>
      </Content>
    </Layout>
  );
}