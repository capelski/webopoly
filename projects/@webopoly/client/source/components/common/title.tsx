import React from 'react';

export type TitleProps = React.InputHTMLAttributes<HTMLHeadingElement> & {
  type?: 'regular' | 'small';
};

export const Title: React.FC<TitleProps> = (props) => {
  const { fontSize, margin } =
    props.type === 'small' ? { fontSize: 20, margin: 0 } : { fontSize: 24, margin: '16px 0' };

  return (
    <h3 {...props} style={{ fontSize, margin, ...props.style }}>
      {props.children}
    </h3>
  );
};
