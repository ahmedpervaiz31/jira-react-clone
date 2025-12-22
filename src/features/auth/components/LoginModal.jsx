import React, { useState } from 'react';
import { Modal, message, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCred } from '../../../store/authSlice';
import LoginForm from './LoginForm';
import RegisterModal from './RegisterModal';
import api from '../../../utils/api';

const { Text, Link } = Typography;

const LoginModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerVisible, setRegisterVisible] = useState(false);

  const handleSubmit = async (values, { resetForm, setSubmitting }, setLoading) => {
    setLoading(true);
    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', values);
      const data = res.data;
      const token = data?.token;
      const user = data?.user;
      if (token && user) {
        localStorage.setItem('token', token);
        dispatch(setCred({ id: user.id || user._id, username: user.username }));
        message.success(`Welcome, ${user.username}!`);
        resetForm();
        setLoading(false);
        setSubmitting(false);
        onClose();
        navigate('/');
      } else {
        message.error('Login failed: unexpected server response');
        setLoading(false);
        setSubmitting(false);
      }
    } catch (err) {
      message.error(err.response?.data?.error || err.message || 'Login failed');
      setLoading(false);
      setSubmitting(false);
    }
  };

  const openRegister = () => {
    onClose();
    setRegisterVisible(true);
  };

  return (
    <>
      <Modal
        title="Login to Jira Clone"
        open={visible}
        onCancel={onClose}
        footer={null}
        centered
        width={400}
      >
        <LoginForm onSubmit={handleSubmit} />
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link onClick={openRegister}>Register</Link>
        </div>
      </Modal>

      <RegisterModal visible={registerVisible} onClose={() => setRegisterVisible(false)} />
    </>
  );
};

export default LoginModal;
