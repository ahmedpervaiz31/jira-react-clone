import React, { useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCred } from '../authSlice';

const LoginModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    
    setTimeout(() => {
      const { username, password } = values;
    
      if (username && password) {
        dispatch(setCred({ 
          username: username,
          id: Date.now(), 
          loginTime: new Date().toISOString()
        }));
        
        message.success(`Welcome, ${username}!`);
        form.resetFields();
        setLoading(false);
        onClose();
      } else {
        message.error('Please enter username and password');
        setLoading(false);
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
      maskStyle={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please enter your username' },
            { min: 3, message: 'Username must be at least 3 characters' }
          ]}
        >
          <Input
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
