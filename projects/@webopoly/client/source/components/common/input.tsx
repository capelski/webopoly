import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input {...props} style={{ fontSize: 20, padding: '8px 16px', ...props.style }} />;
};
