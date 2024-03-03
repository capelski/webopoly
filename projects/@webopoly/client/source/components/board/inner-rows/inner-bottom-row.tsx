import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquaresMap } from './inner-squares-map';

export const InnerBottomRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquaresMap.bottom}
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        height: '100%',
      }}
    />
  );
};
