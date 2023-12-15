import React, { useState } from 'react';
import { createGame } from '../actions';
import { Game } from '../types';

interface CreateGameProps {
  setGame: (game: Game) => void;
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [playersNumber, setPlayersNumber] = useState(2);

  return (
    <div>
      Number of players:{' '}
      <input
        type="number"
        min={2}
        max={8}
        onChange={(event) => {
          const parsedValue = parseInt(event.target.value) || 0;
          const value = Math.max(2, Math.min(8, parsedValue));
          setPlayersNumber(value);
        }}
        value={playersNumber}
      />
      &emsp;
      <button
        onClick={() => {
          props.setGame(createGame(playersNumber));
        }}
        type="button"
      >
        Start game
      </button>
    </div>
  );
};
