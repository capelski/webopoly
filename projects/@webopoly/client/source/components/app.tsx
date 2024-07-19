import React, { useEffect, useState } from 'react';
import { getGameIdParameter } from '../url-params';
import { GameMode } from './game/game-mode';
import { GameModeSelector } from './game/game-mode-selector';
import { LocalGame } from './game/local/local-game';
import { PeersGame } from './game/peers/peers-game';
import { ServerGame } from './game/server/server-game';

const GAME_MODE_STORAGE_KEY = 'gameMode';

export const App: React.FC = () => {
  const [isServerAvailable, setIsServerAvailable] = useState(false);
  const [mode, setMode] = useState<GameMode>();

  const updateMode = (mode: GameMode) => {
    setMode(mode);
    localStorage.setItem(GAME_MODE_STORAGE_KEY, mode);
  };

  useEffect(() => {
    const gameMode = localStorage.getItem(GAME_MODE_STORAGE_KEY) as GameMode | null;
    if (gameMode) {
      setMode(gameMode);
    }

    try {
      fetch('/api/system/is-up').then((response) => {
        if (response.ok) {
          setIsServerAvailable(true);
          const roomIdParam = getGameIdParameter(GameMode.server);
          if (roomIdParam) {
            updateMode(GameMode.server);
          }
        }
      });
      const roomIdParam = getGameIdParameter(GameMode.peers);
      if (roomIdParam) {
        updateMode(GameMode.peers);
      }
    } catch {}
  }, []);

  const cancel = () => {
    setMode(undefined);
    localStorage.removeItem(GAME_MODE_STORAGE_KEY);
  };

  return mode === GameMode.local ? (
    <LocalGame cancel={cancel} />
  ) : mode === GameMode.server ? (
    <ServerGame cancel={cancel} />
  ) : mode === GameMode.peers ? (
    <PeersGame cancel={cancel} />
  ) : (
    <GameModeSelector isServerAvailable={isServerAvailable} setMode={updateMode} />
  );
};
