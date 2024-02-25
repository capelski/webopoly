import React from 'react';

export const Title: React.FC<React.InputHTMLAttributes<HTMLHeadingElement>> = (props) => {
  return (
    <h3 {...props} style={{ fontSize: 24, margin: '16px 0', ...props.style }}>
      {props.children}
    </h3>
  );
};
