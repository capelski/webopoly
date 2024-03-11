import React, { useEffect, useState } from 'react';
import { Button } from '../common/button';

export type GameMode = 'local' | 'online';

export type GameModeProps = {
  setMode: (mode: GameMode) => void;
};

export const GameModeSelector: React.FC<GameModeProps> = (props) => {
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(false);

  useEffect(() => {
    try {
      fetch('/api/system/is-up').then((response) => {
        if (response.ok) {
          setIsOnlineAvailable(true);
        }
      });
    } catch {}
  }, []);

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
        disabled={!isOnlineAvailable}
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
