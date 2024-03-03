import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquaresMap } from './inner-squares-map';

export const InnerTopRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquaresMap.top}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
      }}
    />
  );
};
