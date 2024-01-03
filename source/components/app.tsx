import React, { useEffect, useState } from 'react';
import { minifyGame, restoreMinifiedGame } from '../logic';
import { Game, GameMinified } from '../types';
import { CreateGame } from './create-game';
import { GameComponent } from './game';

const GAME_STORAGE_KEY = 'game';

export const App: React.FC = () => {
  const [game, setGame] = useState<GameMinified>();

  const updateGame = (game: GameMinified) => {
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
        <GameComponent
          clearGame={clearGame}
          game={restoreMinifiedGame(game)}
          updateGame={(game: Game) => {
            updateGame(minifyGame(game));
          }}
        />
      ) : (
        <CreateGame setGame={updateGame} />
      )}
    </div>
  );
};
