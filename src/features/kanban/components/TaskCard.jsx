import React from 'react';
import { Card } from '../../../components/Card';

export const TaskCard = ({ task }) => {
  return (
    <Card>
      <strong>#{task.id}</strong>
      <div>{task.title}</div>
    </Card>
  );
};