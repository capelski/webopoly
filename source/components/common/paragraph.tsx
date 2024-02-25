import React from 'react';

export const Paragraph: React.FC<React.InputHTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p {...props} style={{ fontSize: 20, margin: '8px 0', ...props.style }}>
      {props.children}
    </p>
  );
};
