import React from 'react';
import { NOT_FOUND } from '../utils/constants'; 

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#888', fontSize: '1.5rem' }}>
      <h2>{NOT_FOUND.TITLE}</h2>
      <p>{NOT_FOUND.CONTENT}</p>
    </div>
  );
};

export default NotFound;