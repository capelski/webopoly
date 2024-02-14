import React from 'react';
import { Game, Player } from '../../../types';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { InnerSquareData } from './inner-squares-map';

export type InnerSquareProps = {
  game: Game;
  innerSquare: InnerSquareData;
  isDesktop: boolean;
  players: Player[];
};

export const InnerSquare: React.FC<InnerSquareProps> = (props) => {
  const frames = props.innerSquare.outerSquareIds
    .map((outerSquareId) => {
      const players = props.players.filter((p) => p.squareId === outerSquareId && !p.isInJail);
      return { players, rotate: squaresRotation[outerSquareId] };
    })
    .filter((frame) => frame.players.length > 0);

  return (
    <div
      style={{
        /* Sizing */
        flexBasis: 1,
        flexGrow: 1,
        /* Styling */
        alignItems: 'center',
        display: 'flex',
        fontSize: props.isDesktop ? 32 : 18,
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {frames.map((frame, frameIndex) => {
        return frame.players.map((player, playerIndex) => {
          return (
            <PlayerInSquare
              isActive={player.id === props.game.currentPlayerId}
              key={`${frameIndex}-${playerIndex}`}
              offset={playerIndex}
              player={player}
              rotate={frame.rotate}
            />
          );
        });
      })}
    </div>
  );
};
