import { DefaultAction, defaultActionInterval, GameUpdateType } from '@webopoly/core';
import React, { useEffect, useState } from 'react';

interface ButtonProps {
  autoClick?: GameUpdateType;
  children?: React.ReactNode;
  defaultAction?: DefaultAction;
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

  const [animateDefaultAction, setAnimateDefaultAction] = useState(false);
  const [defaultAction, setDefaultAction] = useState<DefaultAction>();

  const borderRadius = 10;
  const bottom = 0;
  const fontSize = props.style?.fontSize ?? 18;
  const left = 0;
  const padding = 12;

  useEffect(() => {
    if (
      props.defaultAction &&
      props.defaultAction.update.type === props.autoClick &&
      props.defaultAction !== defaultAction // Necessary to animate two actions of the same type in a row
    ) {
      setDefaultAction(props.defaultAction);
      // Immediately setting animateDefaultAction to true doesn't restart the animation
      setAnimateDefaultAction(false);
      window.setTimeout(() => {
        setAnimateDefaultAction(true);
      }, 100);
    } else if (animateDefaultAction) {
      setAnimateDefaultAction(false);
    }
  }, [props.defaultAction]);

  return (
    <span
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        backgroundColor,
        border,
        borderRadius,
        color,
        cursor: props.disabled ? undefined : 'pointer',
        display: 'inline-block',
        fontSize,
        lineHeight: '18px',
        marginRight: 8,
        marginTop: 8,
        opacity: props.disabled ? 0.5 : 1,
        outline: 'none',
        padding,
        position: 'relative',
        ...props.style,
      }}
    >
      <span
        style={{
          backgroundColor: animateDefaultAction ? 'goldenrod' : 'transparent',
          borderRadius,
          bottom,
          left,
          position: 'absolute',
          top: 0,
          transition: animateDefaultAction
            ? `width ${
                props.defaultAction?.interval
                  ? props.defaultAction.interval / 1000
                  : defaultActionInterval
              }s linear`
            : undefined,
          width: animateDefaultAction ? '100%' : 0,
        }}
      />
      {props.children}
      {animateDefaultAction && (
        <span
          style={{
            bottom,
            left,
            fontSize,
            padding,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {props.children}
        </span>
      )}
    </span>
  );
};
