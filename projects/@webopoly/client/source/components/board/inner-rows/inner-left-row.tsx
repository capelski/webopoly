import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquaresMap } from './inner-squares-map';

export const InnerLeftRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquaresMap.left}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
      }}
    />
  );
};
