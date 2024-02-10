import React, { CSSProperties } from 'react';
import { Id } from '../../../types';
import { RowComponentDefinitionProps } from '../row-component-definition';
import { OuterSquare } from './outer-square';

export type OuterRowProps = RowComponentDefinitionProps & {
  idFilter: (squareId: Id) => boolean;
  style?: CSSProperties;
};

export const OuterRow: React.FC<OuterRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.game.squares
        .filter((square) => props.idFilter(square.id))
        .map((square) => {
          const style: CSSProperties = {};

          if (square.id === 20 || square.id === 32) {
            style.borderBottom = undefined;
          }

          return <OuterSquare {...props} key={square.id} square={square} style={style} />;
        })}
    </div>
  );
};
