import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './CreateBoard.module.css'; 

const CreateBoard = ({ onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewBoardName(''); 
  };

  const handleSubmit = () => {
    if (!newBoardName.trim()) return;
    
    onCreate(newBoardName);
    
    setIsModalOpen(false);
    setNewBoardName('');
  };

  return (
    <>
      <div className={styles.triggerContainer}>
        <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />} 
            onClick={showModal}
        >
            Create New Board
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} 
        centered
        width={500}
      >
        <div className={styles.content}>
          <h3 className={styles.heading}>Create New Board</h3>
          
          <Input 
            className={styles.field}
            placeholder="Enter board name..." 
            value={newBoardName}
            autoFocus
            onChange={(e) => setNewBoardName(e.target.value)}
            onPressEnter={handleSubmit}
          />

          <div className={styles.actions}>
            <Button onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleSubmit}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateBoard;