import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquares } from './inner-squares';

export const InnerRightRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquares.right}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    />
  );
};
