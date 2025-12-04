import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCred } from '../authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './LoginModal.module.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Please enter your username'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter your password'),
});

const LoginModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
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
      maskStyle={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <Input
                className={styles.input}
                name="username"
                placeholder="Enter your username"
                prefix={<UserOutlined />}
                size="large"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.username && touched.username ? (
                <div className={styles.error}>{errors.username}</div>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <Input.Password
                className={styles.input}
                name="password"
                placeholder="Enter your password"
                prefix={<LockOutlined />}
                size="large"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? (
                <div className={styles.error}>{errors.password}</div>
              ) : null}
            </div>

            <div className={styles.actions}>
              <Button type="primary" htmlType="submit" loading={loading || isSubmitting} block size="large">
                Login
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default LoginModal;
