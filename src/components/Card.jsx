import React from 'react';
import { Card as AntdCard } from 'antd';
import styles from './Card.module.css';

export const Card = ({ children, ...rest }) => (
  <AntdCard
    size="small"
    className={styles.card}
    bodyStyle={{ padding: 0 }}
    {...rest}
  >
    {children}
  </AntdCard>
);