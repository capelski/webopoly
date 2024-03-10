import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
  type?: 'border' | 'delete' | 'primary' | 'secondary' | 'transparent';
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { backgroundColor, border, color } =
    props.type === 'border'
      ? { backgroundColor: undefined, border: '1px solid black', color: undefined }
      : props.type === 'delete'
      ? { backgroundColor: '#e74c3c', border: undefined, color: 'white' }
      : props.type === 'secondary'
      ? { backgroundColor: '#e0e0e0', border: undefined, color: undefined }
      : props.type === 'transparent'
      ? { backgroundColor: undefined, border: undefined, color: undefined }
      : { backgroundColor: '#3498db', border: undefined, color: 'white' };

  return (
    <span
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        backgroundColor,
        border,
        borderRadius: 10,
        color,
        cursor: props.disabled ? undefined : 'pointer',
        display: 'inline-block',
        fontSize: 18,
        lineHeight: '18px',
        marginRight: 8,
        marginTop: 8,
        opacity: props.disabled ? 0.5 : 1,
        outline: 'none',
        padding: 12,
        ...props.style,
      }}
    >
      {props.children}
    </span>
  );
};
