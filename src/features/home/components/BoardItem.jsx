import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { APP_ROUTES } from '../../../utils/constants'; 
import styles from '../Home.module.css';

const BoardItem = ({ board, onDelete }) => {
  return (
    <div className={styles.boardRow}>
      <Link 
        to={`${APP_ROUTES.KANBAN_BOARD}/${board.id}`} 
        className={styles.boardLinkWrapper}
      >
        <Button type="primary" size="large" block className={styles.boardButton}>
          {board.name}
        </Button>
      </Link>

      <Popconfirm
        title="Delete this board?"
        description="This action cannot be undone."
        onConfirm={(e) => onDelete(e, board.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button 
          danger 
          type="default" 
          size="large" 
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </div>
  );
};

export default BoardItem;