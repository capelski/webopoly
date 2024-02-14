import React, { CSSProperties } from 'react';
import { Game } from '../../../types';
import { InnerSquare } from './inner-square';
import { InnerSquareData } from './inner-squares-map';

export type InnerRowProps = {
  game: Game;
  innerSquares: InnerSquareData[];
  isDesktop: boolean;
  style?: CSSProperties;
};

export const InnerRow: React.FC<InnerRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.innerSquares.map((innerSquare) => {
        return (
          <InnerSquare
            game={props.game}
            innerSquare={innerSquare}
            isDesktop={props.isDesktop}
            key={innerSquare.innerSquareId}
            players={props.game.players}
          />
        );
      })}
    </div>
  );
};
