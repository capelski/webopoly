import React, { useEffect, useState } from 'react';
import { Game } from '../types';
import { CreateGame } from './create-game';
import { GameComponent } from './game';

const GAME_STORAGE_KEY = 'game';

export const App: React.FC = () => {
  const [game, setGame] = useState<Game>();

  const updateGame = (game: Game) => {
    setGame(game);
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
  };

  const clearGame = () => {
    setGame(undefined);
    localStorage.removeItem(GAME_STORAGE_KEY);
  };

  useEffect(() => {
    const storageGame = localStorage.getItem(GAME_STORAGE_KEY);
    const parsedGame = storageGame && JSON.parse(storageGame);
    if (parsedGame) {
      setGame(parsedGame);
    }
  }, []);

  return (
    <div>
      {game ? (
        <GameComponent clearGame={clearGame} game={game} updateGame={updateGame} />
      ) : (
        <CreateGame setGame={updateGame} />
      )}
    </div>
  );
};
