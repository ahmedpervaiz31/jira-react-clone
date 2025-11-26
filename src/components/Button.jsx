import React from 'react';
import { Button as AntdButton } from 'antd';

export const Button = ({ children, onClick, type = 'button', btnType = 'default', ...rest }) => (
  <AntdButton 
    htmlType={type} 
    onClick={onClick}
    type={btnType}
    {...rest}
  >
    {children}
  </AntdButton>
);