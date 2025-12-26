import React from 'react';
import { Modal } from 'antd';
import TaskSearch from '../features/tasksearch/TaskSearch';
import styles from './SearchModal.module.css';

const SearchModal = ({ visible, onClose }) => (
  <Modal
    open={visible}
    onCancel={onClose}
    footer={null}
    title={null}
    width="100%"
    className={styles.searchModal}
    closeIcon={null}
  >
    <div className={styles.mobileSearchBarWrapper}>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
           <div style={{ width: '100%' }}>
             <TaskSearch autoFocus onItemSelect={onClose} /> 
           </div>
        </div>
      </div>

    </div>
  </Modal>
);

export default SearchModal;