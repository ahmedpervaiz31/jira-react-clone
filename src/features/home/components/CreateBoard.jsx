import React, { useState } from 'react';
import { Button, Input, Modal, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './CreateBoard.module.css'; 

import { useDispatch, useSelector } from 'react-redux';
import { searchUsersAsync, selectUserSearchResults, selectUserSearchLoading } from '../../../store/userSlice';
import { useAuth } from '../../auth/hooks/useAuth';

const CreateBoard = ({ onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [flag, setFlag] = useState('public');
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const dispatch = useDispatch();
  const userOptions = useSelector(selectUserSearchResults);
  const fetchingUsers = useSelector(selectUserSearchLoading);
  const { user } = useAuth();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewBoardName('');
    setFlag('public');
    setMembers([]);
    setMemberSearch('');
  };

  const handleSubmit = () => {
    if (!newBoardName.trim()) return;
    let finalMembers = members;
    if (flag === 'private') {
      if (user && user.username && !finalMembers.includes(user.username)) {
        finalMembers = [user.username, ...finalMembers];
      }
    } else {
      finalMembers = [];
    }
    onCreate({ name: newBoardName, flag, members: finalMembers });
    setIsModalOpen(false);
    setNewBoardName('');
    setFlag('public');
    setMembers([]);
    setMemberSearch('');
  };

  return (
    <>
      <div className={styles.triggerContainer}>
        <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />} 
            onClick={showModal}
            className={styles.Btn}
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

          <Select
            className={styles.field}
            value={flag}
            onChange={setFlag}
            style={{ width: '100%' }}
          >
            <Select.Option value="public">Public</Select.Option>
            <Select.Option value="private">Private</Select.Option>
          </Select>

          {flag === 'private' && (
            <Select
              mode="multiple"
              className={styles.field}
              placeholder="Add members by username"
              value={members}
              onChange={setMembers}
              style={{ width: '100%' }}
              showSearch
              filterOption={false}
              onSearch={value => {
                setMemberSearch(value);
                dispatch(searchUsersAsync(value));
              }}
              onFocus={() => {
                dispatch(searchUsersAsync(''));
              }}
              notFoundContent={fetchingUsers ? 'Searching...' : 'No users found'}
              optionLabelProp="label"
            >
              {(Array.isArray(userOptions) ? userOptions : []).filter(u => u.username !== user?.username).map(u => (
                <Select.Option key={u.username} value={u.username} label={u.username}>
                  {u.username}
                </Select.Option>
              ))}
            </Select>
          )}

          <div className={styles.actions}>
            <Button type="secondary" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button type="primary" icon={<PlusOutlined />} className={styles.Btn} onClick={handleSubmit}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateBoard;