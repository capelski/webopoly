import React, { useState } from 'react';
import { createGame } from '../actions';
import { GameMinified } from '../types';
import { Button } from './button';

interface CreateGameProps {
  setGame: (game: GameMinified) => void;
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
      <Button
        onClick={() => {
          props.setGame(createGame(playersNumber));
        }}
      >
        Start game
      </Button>
    </div>
  );
};
