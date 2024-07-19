import React from 'react';
import { Button } from '../common/button';
import { GameMode } from './game-mode';

export type GameModeProps = {
  isServerAvailable: boolean;
  setMode: (mode: GameMode) => void;
};

export const GameModeSelector: React.FC<GameModeProps> = (props) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100dvh',
      }}
    >
      <Button
        onClick={() => {
          props.setMode(GameMode.local);
        }}
        style={{ marginBottom: 16 }}
        type="border"
      >
        Local game
      </Button>

      <Button
        onClick={() => {
          props.setMode(GameMode.peers);
        }}
        style={{ marginBottom: 16 }}
      >
        Peers game
      </Button>

      <Button
        disabled={!props.isServerAvailable}
        onClick={() => {
          props.setMode(GameMode.server);
        }}
      >
        Server game
      </Button>
    </div>
  );
};
