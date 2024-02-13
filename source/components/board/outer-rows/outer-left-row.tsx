import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';
import { outerSquaresMap } from './outer-squares-map';

export const OuterLeftRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      outerSquareIds={outerSquaresMap.left}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
      }}
    />
  );
};
