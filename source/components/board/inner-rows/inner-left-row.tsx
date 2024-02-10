import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquares } from './inner-squares';

export const InnerLeftRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquares.left}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
      }}
    />
  );
};
