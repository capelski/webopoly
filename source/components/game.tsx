import React from 'react';
import { Game } from '../types';
import { ActionsBar } from './sections/actions-bar';
import { Board } from './sections/board';
import { EventHistory } from './sections/event-history';
import { Notifications } from './sections/notifications';
import { Players } from './sections/players';
import { PromptContainer } from './sections/prompt-container';

interface GameComponentProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Notifications game={props.game} updateGame={props.updateGame} />

      <PromptContainer game={props.game} updateGame={props.updateGame} />

      <Players currentPlayerId={props.game.currentPlayerId} players={props.game.players} />

      <Board game={props.game} updateGame={props.updateGame} />

      <EventHistory game={props.game} updateGame={props.updateGame} />

      <ActionsBar game={props.game} updateGame={props.updateGame} />
    </div>
  );
};
