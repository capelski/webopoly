import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';
import { outerSquaresMap } from './outer-squares-map';

export const OuterBottomRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      outerSquareIds={outerSquaresMap.bottom}
      style={{
        borderTop: '1px solid #aaa',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row-reverse',
        height: '100%',
      }}
    />
  );
};
