import React, { useState } from 'react';
import { Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './LoginModal.module.css';
import LoginFields from './LoginFields';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Please enter your username'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter a password'),
});

const RegisterForm = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values, formikHelpers) => {
    setLoading(true);
    if (onSubmit) onSubmit({ username: values.username, password: values.password }, formikHelpers, setLoading);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <LoginFields
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <div className={styles.actions}>
            <Button type="primary" htmlType="submit" loading={loading || isSubmitting} block size="large">
              Register
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
