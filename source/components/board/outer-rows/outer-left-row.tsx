import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';

export const OuterLeftRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      idFilter={(squareId) => squareId >= 32}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
      }}
    />
  );
};
