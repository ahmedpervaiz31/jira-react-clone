import React from 'react';

export const Button = ({ children, onClick, style = {}, type = 'button' }) => (
  <button 
    type={type}
    onClick={onClick}
    style={{
      backgroundColor: '#e0e0e0',
      border: '1px solid black',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '12px',
      ...style
    }}
  >
    {children}
  </button>
);