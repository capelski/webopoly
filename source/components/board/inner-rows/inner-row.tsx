import React, { CSSProperties } from 'react';
import { Game } from '../../../types';
import { InnerSquare } from './inner-square';
import { InnerSquaresFrame } from './inner-squares';

export type InnerRowProps = {
  game: Game;
  innerSquares: InnerSquaresFrame[];
  isDesktop: boolean;
  style?: CSSProperties;
};

export const InnerRow: React.FC<InnerRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.innerSquares.map((innerSquareFrames, rowIndex) => {
        return (
          <InnerSquare
            frames={innerSquareFrames}
            isDesktop={props.isDesktop}
            key={rowIndex}
            players={props.game.players}
          />
        );
      })}
    </div>
  );
};
