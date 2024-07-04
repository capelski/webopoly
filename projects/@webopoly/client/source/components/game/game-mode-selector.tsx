import React from 'react';
import { Button } from '../common/button';

export type GameMode = 'local' | 'server';

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
        justifyContent: 'center',
        minHeight: '100dvh',
      }}
    >
      <Button
        disabled={!props.isServerAvailable}
        onClick={() => {
          props.setMode('server');
        }}
      >
        Server game
      </Button>

      <Button
        onClick={() => {
          props.setMode('local');
        }}
      >
        Local game
      </Button>
    </div>
  );
};
