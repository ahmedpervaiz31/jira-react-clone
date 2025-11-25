import React, { useState } from 'react';
import { Button } from '../../../components/Button';

export const CreateCard = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px', borderTop: '1px dashed black', paddingTop: '10px' }}>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="New task..."
        style={{ width: '90%', marginBottom: '5px', padding: '5px' }}
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
};