import React, { useEffect, useState } from 'react';
import { getGameIdParameter } from '../url-params';
import { GameMode, GameModeSelector } from './game/game-mode-selector';
import { LocalGame } from './game/local/local-game';
import { ServerGame } from './game/server/server-game';

const GAME_MODE_STORAGE_KEY = 'gameMode';

export const App: React.FC = () => {
  const [isServerAvailable, setIsServerAvailable] = useState(false);
  const [mode, setMode] = useState<GameMode>();

  useEffect(() => {
    const gameMode = localStorage.getItem(GAME_MODE_STORAGE_KEY) as GameMode | null;
    if (gameMode) {
      setMode(gameMode);
    }

    try {
      fetch('/api/system/is-up').then((response) => {
        if (response.ok) {
          setIsServerAvailable(true);
          const roomIdParam = getGameIdParameter();
          if (roomIdParam) {
            setMode('server');
          }
        }
      });
    } catch {}
  }, []);

  const updateMode = (mode: GameMode) => {
    setMode(mode);
    localStorage.setItem(GAME_MODE_STORAGE_KEY, mode);
  };

  const cancel = () => {
    setMode(undefined);
    localStorage.removeItem(GAME_MODE_STORAGE_KEY);
  };

  return mode === 'local' ? (
    <LocalGame cancel={cancel} />
  ) : mode === 'server' ? (
    <ServerGame cancel={cancel} />
  ) : (
    <GameModeSelector isServerAvailable={isServerAvailable} setMode={updateMode} />
  );
};
