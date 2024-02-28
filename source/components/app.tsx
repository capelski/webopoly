import React, { useEffect, useState } from 'react';
import { deserializeGame, serializeGame } from '../logic';
import { Game } from '../types';
import { CreateGame } from './create-game';
import { GameComponent } from './game';

const GAME_STORAGE_KEY = 'game';

export const App: React.FC = () => {
  const [game, setGame] = useState<Game>();

  const updateGame = (game: Game | undefined) => {
    setGame(game);
    if (game) {
      localStorage.setItem(GAME_STORAGE_KEY, serializeGame(game));
    } else {
      localStorage.removeItem(GAME_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const serializedGame = localStorage.getItem(GAME_STORAGE_KEY);
    setGame(deserializeGame(serializedGame));
  }, []);

  return game ? (
    <GameComponent game={game} updateGame={updateGame} />
  ) : (
    <CreateGame setGame={updateGame} />
  );
};
