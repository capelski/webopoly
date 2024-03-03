import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';
import { outerSquaresMap } from './outer-squares-map';

export const OuterRightRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      outerSquareIds={outerSquaresMap.right}
      style={{
        borderLeft: '1px solid #aaa',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    />
  );
};
