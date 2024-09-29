import {
  Game,
  GamePhase,
  GameUpdate,
  getCurrentPlayer,
  getNextSquareId,
  Player,
  playerTransitionDuration,
} from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Board } from '../board/board';
import { Players } from '../player/players';
import { ActionsBar } from '../sections/actions-bar';
import { EventHistory } from '../sections/event-history';
import { Notifications } from '../sections/notifications';
import { PromptContainer } from '../sections/prompt-container';

const triggerAvatarAnimation = (
  game: Game<GamePhase.avatarAnimation>,
): Game<GamePhase.avatarAnimation> => {
  return {
    ...game,
    phaseData: {
      currentSquareId: getNextSquareId(game, 1, game.phaseData.currentSquareId),
      pendingMoves: game.phaseData.pendingMoves - 1,
    },
  };
};

interface GameComponentProps {
  clearNotifications: () => void;
  exitGame: () => void;
  game: Game<any>;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const isLandscape = useMediaQuery({ orientation: 'landscape' });

  const [game, setGame] = useState(props.game);
  const [playerAnimationInterval, setPlayerAnimationInterval] = useState<
    NodeJS.Timeout | undefined
  >();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setGame(props.game);
    if (props.game.phase === GamePhase.avatarAnimation) {
      let updatedGame = props.game;

      const nextPlayerAnimationInterval = setInterval(() => {
        updatedGame = triggerAvatarAnimation(updatedGame);
        setGame(updatedGame);

        if (updatedGame.phaseData.pendingMoves === 1) {
          // No need to animate the last move, as props.game will be updated at that time
          clearInterval(nextPlayerAnimationInterval);
        }
      }, playerTransitionDuration * 1000);
      setPlayerAnimationInterval(nextPlayerAnimationInterval);
    } else {
      clearInterval(playerAnimationInterval);
    }
  }, [props.game]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Notifications clearNotifications={props.clearNotifications} game={game} />

      <PromptContainer
        exitGame={props.exitGame}
        game={game}
        triggerUpdate={props.triggerUpdate}
        windowPlayerId={props.windowPlayerId}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          // Necessary for the event history not to generate scroll past the board
          height: isLandscape ? `${100 * zoom}dvh` : undefined,
          overflow: 'hidden',
        }}
      >
        <Board
          game={game}
          isLandscape={isLandscape}
          triggerUpdate={props.triggerUpdate}
          windowPlayerId={props.windowPlayerId}
          zoom={zoom}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <ActionsBar
            exitGame={props.exitGame}
            game={game}
            setZoom={setZoom}
            triggerUpdate={props.triggerUpdate}
            windowPlayerId={props.windowPlayerId}
            zoom={zoom}
          />

          <Players
            currentPlayerId={getCurrentPlayer(game).id}
            players={game.players}
            windowPlayerId={props.windowPlayerId}
          />

          <EventHistory game={game} />
        </div>
      </div>
    </div>
  );
};
