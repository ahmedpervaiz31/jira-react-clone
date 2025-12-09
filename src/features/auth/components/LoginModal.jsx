import React from 'react';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { setCred } from '../authSlice';
import LoginForm from './LoginForm';

const LoginModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm, setSubmitting }, setLoading) => {
    setLoading(true);
    setSubmitting(true);
    setTimeout(() => {
      const { username, password } = values;
      if (username && password) {
        dispatch(
          setCred({
            username,
            id: Date.now(),
            loginTime: new Date().toISOString(),
          })
        );
        message.success(`Welcome, ${username}!`);
        resetForm();
        setLoading(false);
        setSubmitting(false);
        onClose();
      } else {
        message.error('Please enter username and password');
        setLoading(false);
        setSubmitting(false);
      }
    }, 500);
  };

  return (
    <Modal
      title="Login to Jira Clone"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <LoginForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default LoginModal;
