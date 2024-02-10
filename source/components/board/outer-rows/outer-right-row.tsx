import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { OuterRow } from './outer-row';

export const OuterRightRow: RowComponentDefinition = (props) => {
  return (
    <OuterRow
      {...props}
      idFilter={(squareId) => squareId >= 12 && squareId < 21}
      style={{
        borderLeft: '1px solid #aaa',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    />
  );
};
