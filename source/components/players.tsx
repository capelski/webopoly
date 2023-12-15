import React from 'react';
import { Player } from '../types';
import { PlayerComponent } from './player';

interface PlayersProps {
  currentPlayer: number;
  players: Player[];
}

export const Players: React.FC<PlayersProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24 }}>
      {props.players.map((player, index) => (
        <PlayerComponent
          isActive={index === props.currentPlayer}
          key={player.name}
          player={player}
        />
      ))}
    </div>
  );
};
