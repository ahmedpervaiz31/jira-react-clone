import React from 'react';
import { Card as AntdCard } from 'antd';


export const Card = ({ children, ...rest }) => (
  <AntdCard
    size="small"
    style={{ marginBottom: '10px' }}
    bodyStyle={{ padding: '10px' }} 
    {...rest}
  >
    {children}
  </AntdCard>
);