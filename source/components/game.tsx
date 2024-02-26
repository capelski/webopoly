import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { getCurrentPlayer } from '../logic';
import { Game } from '../types';
import { Board } from './board/board';
import { Players } from './player/players';
import { ActionsBar } from './sections/actions-bar';
import { EventHistory } from './sections/event-history';
import { Notifications } from './sections/notifications';
import { PromptContainer } from './sections/prompt-container';

interface GameComponentProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const isLandscape = useMediaQuery({ orientation: 'landscape' });
  const currentPlayer = getCurrentPlayer(props.game);

  const [zoom, setZoom] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Notifications game={props.game} updateGame={props.updateGame} />

      <PromptContainer game={props.game} updateGame={props.updateGame} />

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
          zoom={zoom}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <ActionsBar
            game={props.game}
            setZoom={setZoom}
            updateGame={props.updateGame}
            zoom={zoom}
          />

          <Players currentPlayerId={currentPlayer.id} players={props.game.players} />

          <EventHistory game={props.game} updateGame={props.updateGame} />
        </div>
      </div>
    </div>
  );
};
