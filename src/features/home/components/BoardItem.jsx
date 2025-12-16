import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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

      <Button
        danger
        type="secondary"
        size="large"
        icon={<DeleteOutlined />}
        onClick={() => {
          Modal.confirm({
            title: 'Delete this board?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okType: 'danger',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk() {
              onDelete && onDelete(board.id);
            }
          });
        }}
      />
    </div>
  );
};

export default BoardItem;