import React from 'react';
import { Modal, message, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCred } from '../../../store/authSlice';
import RegisterForm from './RegisterForm';
import api from '../../../utils/api';

const { Text, Link } = Typography;

const RegisterModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm, setSubmitting }, setLoading) => {
    setLoading(true);
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', values);
      const data = res.data;
      const token = data?.token;
      const user = data?.user;
      if (token && user) {
        localStorage.setItem('token', token);
        dispatch(setCred({ id: user.id || user._id, username: user.username }));
        message.success('Registration successful. Welcome!');
        resetForm();
        setLoading(false);
        setSubmitting(false);
        onClose();
        navigate('/');
      } else {
        message.success('Registration succeeded. Please log in.');
        navigate('/login');
      }
    } catch (err) {
      message.error(err.response?.data?.error || err.message || 'Registration failed');
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Register for Jira Clone"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <RegisterForm onSubmit={handleSubmit} />
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Text type="secondary">Already have an account? </Text>
        <Link onClick={() => { onClose(); navigate('/login'); }}>Login</Link>
      </div>
    </Modal>
  );
};

export default RegisterModal;