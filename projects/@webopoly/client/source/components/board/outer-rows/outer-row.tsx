import React, { CSSProperties } from 'react';
import { Id } from '../../../../../core';
import { RowComponentDefinitionProps } from '../row-component-definition';
import { OuterSquare } from './outer-square';

export type OuterRowProps = RowComponentDefinitionProps & {
  outerSquareIds: Id[];
  style?: CSSProperties;
  zoom: number;
};

export const OuterRow: React.FC<OuterRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.game.squares
        .filter((square) => props.outerSquareIds.includes(square.id))
        .map((square) => {
          const style: CSSProperties = {};

          if (square.id === 12 || square.id === 40) {
            style.borderBottom = undefined;
          }

          return <OuterSquare {...props} key={square.id} square={square} style={style} />;
        })}
    </div>
  );
};
