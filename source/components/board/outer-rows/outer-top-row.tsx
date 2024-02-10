import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';

export const OuterTopRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      idFilter={(squareId) => squareId < 12}
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
