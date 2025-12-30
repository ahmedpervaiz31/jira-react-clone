import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import DeleteButton from '../../../components/DeleteButton';
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

      <DeleteButton
        icon={<DeleteOutlined />}
        onConfirm={() => onDelete && onDelete(board.id)}
        modalTitle="Delete this board?"
        modalContent="This action cannot be undone."
      />
    </div>
  );
};

export default BoardItem;