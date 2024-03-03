import React, { CSSProperties } from 'react';
import { Game } from '../../../../../core';
import { InnerSquare } from './inner-square';
import { InnerSquareData } from './inner-squares-map';

export type InnerRowProps = {
  game: Game;
  innerSquares: InnerSquareData[];
  isLandscape: boolean;
  style?: CSSProperties;
  zoom: number;
};

export const InnerRow: React.FC<InnerRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.innerSquares.map((innerSquare) => {
        return (
          <InnerSquare
            game={props.game}
            innerSquare={innerSquare}
            isLandscape={props.isLandscape}
            key={innerSquare.innerSquareId}
            zoom={props.zoom}
          />
        );
      })}
    </div>
  );
};
