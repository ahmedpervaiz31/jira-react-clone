import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardDeletedRedirectModal.module.css';

export default function BoardDeletedRedirectModal({ visible, reason }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      // Redirect after a short delay for user to see the message
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, navigate]);

  if (!visible) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Board Deleted</h2>
        <p>{reason || 'This board was deleted by another user. You will be redirected to the main page.'}</p>
        <button className={styles.redirectBtn} onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
}
