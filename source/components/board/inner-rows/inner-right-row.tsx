import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquaresMap } from './inner-squares-map';

export const InnerRightRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquaresMap.right}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    />
  );
};
