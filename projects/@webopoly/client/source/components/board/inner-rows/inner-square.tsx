import { Game, GamePhase, getCurrentPlayer } from '@webopoly/core';
import React from 'react';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { InnerSquareData } from './inner-squares-map';

export type InnerSquareProps = {
  game: Game<any>;
  innerSquare: InnerSquareData;
  isLandscape: boolean;
  zoom: number;
};

export const InnerSquare: React.FC<InnerSquareProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  const frames = props.innerSquare.outerSquareIds
    .map((outerSquareId) => {
      const players = props.game.players.filter((p) => {
        const phaseData = props.game.phase === GamePhase.avatarAnimation && props.game.phaseData;

        const isPlayerTransitioning = phaseData && p.id === currentPlayer.id;

        return isPlayerTransitioning
          ? phaseData.currentSquareId === outerSquareId
          : p.squareId === outerSquareId && !p.isInJail;
      });
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
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {frames.map((frame, frameIndex) => {
        return frame.players.map((player, playerIndex) => {
          return (
            <PlayerInSquare
              isActive={player.id === currentPlayer.id}
              isLandscape={props.isLandscape}
              key={`${frameIndex}-${playerIndex}`}
              offset={playerIndex}
              player={player}
              rotate={frame.rotate}
              zoom={props.zoom}
            />
          );
        });
      })}
    </div>
  );
};
