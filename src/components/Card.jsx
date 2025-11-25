import React from 'react';

/**
 * A generic container card component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.style] - Inline style overrides.
 * @returns {JSX.Element}
 */
export const Card = ({ children, style = {} }) => (
  <div style={{
    border: '1px solid black',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'white',
    ...style
  }}>
    {children}
  </div>
);