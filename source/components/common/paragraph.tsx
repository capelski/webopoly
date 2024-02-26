import React from 'react';

export type ParagraphProps = React.InputHTMLAttributes<HTMLParagraphElement> & {
  type?: 'regular' | 'small';
};

export const Paragraph: React.FC<React.InputHTMLAttributes<HTMLParagraphElement>> = (props) => {
  return (
    <p
      {...props}
      style={{
        fontSize: props.type === 'small' ? 18 : 20,
        margin: props.type === 'small' ? '0' : '8px 0',
        ...props.style,
      }}
    >
      {props.children}
    </p>
  );
};
