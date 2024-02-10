import React from 'react';
import { RowComponentDefinition, RowComponentDefinitionProps } from './row-component-definition';

interface GridProps extends RowComponentDefinitionProps {
  children?: React.ReactNode;
  gridSize: number;
  rows: {
    bottom: RowComponentDefinition;
    left: RowComponentDefinition;
    right: RowComponentDefinition;
    top: RowComponentDefinition;
  };
}

export const Grid: React.FC<GridProps> = (props) => {
  const size = Math.floor((100 * 100) / props.gridSize) / 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <div style={{ flexBasis: `${size}%` }}>{props.rows.top(props)}</div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexBasis: `${(props.gridSize - 2) * size}%`,
        }}
      >
        <div style={{ flexBasis: `${size}%` }}>{props.rows.left(props)}</div>
        <div
          style={{
            flexBasis: `${(props.gridSize - 2) * size}%`,
          }}
        >
          {props.children}
        </div>
        <div style={{ flexBasis: `${size}%` }}>{props.rows.right(props)}</div>
      </div>

      <div style={{ flexBasis: `${size}%` }}>{props.rows.bottom(props)}</div>
    </div>
  );
};
