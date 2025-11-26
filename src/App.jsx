import React from 'react';
import KanbanApp from './features/kanban/UI/KanbanApp.jsx';
import { Layout } from 'antd';

const { Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
      <Content style={{ padding: '0 50px', marginTop: 24, height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column',  overflow: 'hidden' }}>
        <KanbanApp />
      </Content>
    </Layout>
  );
}