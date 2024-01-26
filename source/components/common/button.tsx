import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{
        padding: 8,
        outline: 'none',
        marginRight: 8,
        ...props.style,
      }}
      type="button"
    >
      {props.children}
    </button>
  );
};
