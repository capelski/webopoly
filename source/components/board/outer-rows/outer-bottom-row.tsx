import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';

export const OuterBottomRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      idFilter={(squareId) => squareId >= 21 && squareId < 32}
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
