import React from 'react';
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
  const isDesktop = useMediaQuery({ minWidth: 728 });
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Notifications game={props.game} updateGame={props.updateGame} />

      <PromptContainer game={props.game} updateGame={props.updateGame} />

      <div
        style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          height: isDesktop ? '100vh' : undefined,
          overflow: 'hidden',
        }}
      >
        <Board game={props.game} isDesktop={isDesktop} updateGame={props.updateGame} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ActionsBar game={props.game} updateGame={props.updateGame} />

          <Players currentPlayerId={currentPlayer.id} players={props.game.players} />

          <EventHistory game={props.game} updateGame={props.updateGame} />
        </div>
      </div>
    </div>
  );
};
