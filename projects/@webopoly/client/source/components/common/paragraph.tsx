import React from 'react';

export type ParagraphProps = React.InputHTMLAttributes<HTMLParagraphElement> & {
  type?: 'regular' | 'small';
};

export const Paragraph: React.FC<React.InputHTMLAttributes<HTMLParagraphElement>> = (props) => {
  const { fontSize, margin } =
    props.type === 'small' ? { fontSize: 16, margin: 0 } : { fontSize: 20, margin: '8px 0' };

  return (
    <p
      {...props}
      style={{
        fontSize,
        margin,
        ...props.style,
      }}
    >
      {props.children}
    </p>
  );
};
