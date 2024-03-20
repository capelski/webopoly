import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Game, getCurrentPlayer, Player } from '../../../../core';
import { Board } from '../board/board';
import { Players } from '../player/players';
import { ActionsBar } from '../sections/actions-bar';
import { EventHistory } from '../sections/event-history';
import { Notifications } from '../sections/notifications';
import { PromptContainer } from '../sections/prompt-container';

interface GameComponentProps {
  clearNotifications: () => void;
  exitGame: () => void;
  game: Game;
  updateGame: (game: Game) => void;
  windowPlayerId: Player['id'];
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const isLandscape = useMediaQuery({ orientation: 'landscape' });
  const currentPlayer = getCurrentPlayer(props.game);

  const [zoom, setZoom] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Notifications clearNotifications={props.clearNotifications} game={props.game} />

      <PromptContainer
        exitGame={props.exitGame}
        game={props.game}
        updateGame={props.updateGame}
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
          game={props.game}
          isLandscape={isLandscape}
          updateGame={props.updateGame}
          windowPlayerId={props.windowPlayerId}
          zoom={zoom}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <ActionsBar
            exitGame={props.exitGame}
            game={props.game}
            setZoom={setZoom}
            updateGame={props.updateGame}
            windowPlayerId={props.windowPlayerId}
            zoom={zoom}
          />

          <Players
            currentPlayerId={currentPlayer.id}
            players={props.game.players}
            windowPlayerId={props.windowPlayerId}
          />

          <EventHistory game={props.game} />
        </div>
      </div>
    </div>
  );
};
