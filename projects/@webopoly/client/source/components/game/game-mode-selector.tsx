import React from 'react';
import { Button } from '../common/button';

export type GameMode = 'local' | 'online';

export type GameModeProps = {
  isOnlineAvailable: boolean;
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
        disabled={!props.isOnlineAvailable}
        onClick={() => {
          props.setMode('online');
        }}
      >
        Play online
      </Button>

      <Button
        onClick={() => {
          props.setMode('local');
        }}
      >
        Play local
      </Button>
    </div>
  );
};
