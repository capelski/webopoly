import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquares } from './inner-squares';

export const InnerTopRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquares.top}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
      }}
    />
  );
};
