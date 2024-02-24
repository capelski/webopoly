import React, { useState } from 'react';
import { createGame } from '../logic';
import { GameMinified } from '../types';
import { Button } from './common/button';

interface CreateGameProps {
  setGame: (game: GameMinified) => void;
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        top: '200px',
      }}
    >
      <div style={{ marginBottom: 48 }}>
        <Button
          onClick={() => {
            props.setGame(createGame(playerNames));
          }}
        >
          Start game
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button
          disabled={playerNames.length === 8}
          onClick={() => {
            setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
          }}
        >
          Add player
        </Button>
      </div>

      {playerNames.map((playerName, index) => {
        return (
          <div style={{ marginBottom: 8 }} key={index}>
            <input
              onChange={(event) => {
                setPlayerNames(playerNames.map((p, i) => (i === index ? event.target.value : p)));
              }}
              value={playerName}
              style={{ marginRight: 8 }}
            />
            <Button
              disabled={playerNames.length === 2}
              onClick={() => {
                setPlayerNames(playerNames.filter((_, i) => index !== i));
              }}
            >
              🗑️
            </Button>
          </div>
        );
      })}
    </div>
  );
};
