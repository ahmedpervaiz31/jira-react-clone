import React from 'react';
import { Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './LoginModal.module.css';

const LoginFields = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
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
  </>
);

export default LoginFields;
