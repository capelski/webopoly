import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';
import { outerSquaresMap } from './outer-squares-map';

export const OuterTopRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      outerSquareIds={outerSquaresMap.top}
      style={{
        borderTop: '1px solid #aaa',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
      }}
    />
  );
};
