import React from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './DeleteButton.module.css';
import { DELETE_MODAL } from '../utils/constants';

const DeleteButton = ({
  onConfirm,
  icon,
  buttonProps = {},
  modalTitle = DELETE_MODAL.TITLE,
  modalContent = DELETE_MODAL.CONTENT,
  okText = DELETE_MODAL.OK_TEXT,
  cancelText = 'Cancel',
  okType = 'danger',
  children
}) => {
  const handleClick = (e) => {
    if (buttonProps.onClick) {
      buttonProps.onClick(e);
    }
    Modal.confirm({
      title: modalTitle,
      icon: <ExclamationCircleOutlined />,
      content: modalContent,
      okType,
      okText,
      cancelText,
      onOk: onConfirm,
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { type: 'secondary' }
    });
  };
  return (
    <Button
      danger
      type="secondary"
      size="large"
      icon={icon}
      {...buttonProps}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default DeleteButton;
