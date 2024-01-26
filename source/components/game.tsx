import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { GameView } from '../enums';
import { Game } from '../types';
import { ActionsBar } from './sections/actions-bar';
import { Board } from './sections/board';
import { MobileBar } from './sections/mobile-bar';
import { Notifications } from './sections/notifications';
import { Panel } from './sections/panel';
import { PromptContainer } from './sections/prompt-container';

interface GameComponentProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [gameView, setGameView] = useState(GameView.board);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Notifications game={props.game} updateGame={props.updateGame} />

      <PromptContainer game={props.game} updateGame={props.updateGame} />

      {!isDesktop && <MobileBar gameView={gameView} setGameView={setGameView} />}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {(isDesktop || gameView === GameView.board) && (
          <Board game={props.game} isDesktop={isDesktop} updateGame={props.updateGame} />
        )}

        {(isDesktop || gameView === GameView.panel) && (
          <Panel game={props.game} isDesktop={isDesktop} updateGame={props.updateGame} />
        )}
      </div>

      <ActionsBar game={props.game} updateGame={props.updateGame} />
    </div>
  );
};
