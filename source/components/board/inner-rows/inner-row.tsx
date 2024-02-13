import React, { CSSProperties } from 'react';
import { Game } from '../../../types';
import { InnerSquare } from './inner-square';
import { InnerSquareMapping } from './inner-squares-map';

export type InnerRowProps = {
  game: Game;
  innerSquares: InnerSquareMapping[];
  isDesktop: boolean;
  style?: CSSProperties;
};

export const InnerRow: React.FC<InnerRowProps> = (props) => {
  return (
    <div style={props.style}>
      {props.innerSquares.map((innerSquareMapping, rowIndex) => {
        return (
          <InnerSquare
            isDesktop={props.isDesktop}
            key={rowIndex}
            outerSquareIds={innerSquareMapping}
            players={props.game.players}
          />
        );
      })}
    </div>
  );
};
