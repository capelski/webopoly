import React from 'react';
import { GamePhase, TransitionType } from '../../../enums';
import { getCurrentPlayer } from '../../../logic';
import { Game } from '../../../types';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { InnerSquareData } from './inner-squares-map';

export type InnerSquareProps = {
  game: Game;
  innerSquare: InnerSquareData;
  isDesktop: boolean;
};

export const InnerSquare: React.FC<InnerSquareProps> = (props) => {
  const frames = props.innerSquare.outerSquareIds
    .map((outerSquareId) => {
      const players = props.game.players.filter((p) => {
        const transitionData =
          props.game.phase === GamePhase.uiTransition &&
          props.game.transitionType === TransitionType.player &&
          props.game.transitionData;

        const isPlayerTransitioning = transitionData && p.id === transitionData.playerId;

        return isPlayerTransitioning
          ? transitionData.currentSquareId === outerSquareId
          : p.squareId === outerSquareId && !p.isInJail;
      });
      return { players, rotate: squaresRotation[outerSquareId] };
    })
    .filter((frame) => frame.players.length > 0);
  const currentPlayer = getCurrentPlayer(props.game);

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
              isDesktop={props.isDesktop}
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
