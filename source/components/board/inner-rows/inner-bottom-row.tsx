import React from 'react';
import { RowComponentDefinition } from '../row-component-definition';
import { InnerRow } from './inner-row';
import { innerSquares } from './inner-squares';

export const InnerBottomRow: RowComponentDefinition = (props) => {
  return (
    <InnerRow
      {...props}
      innerSquares={innerSquares.bottom}
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        height: '100%',
      }}
    />
  );
};
