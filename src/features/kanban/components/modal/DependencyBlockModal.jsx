import React from 'react';
import styles from './DependencyBlockModal.module.css';

const DependencyBlockModal = ({ visible, onClose, blockingTasks }) => {
  if (!visible) return null;
  return (
    <div className={styles.blockModal}>
      <div className={styles.modalContent}>
        <h3>Cannot Move Task</h3>
        <p>One or more dependencies are not in progress or done</p>
        <ul>
          {blockingTasks && blockingTasks.map((t) => (
            <li key={t.id}>{t.title} 
              <span className={styles.status}>
                ({t.status.replace('_', ' ')})
              </span>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default DependencyBlockModal;
