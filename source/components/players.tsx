import React from 'react';
import { Player } from '../types';
import { PlayerComponent } from './player';

interface PlayersProps {
  currentPlayerId: number;
  players: Player[];
}

export const Players: React.FC<PlayersProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24 }}>
      {props.players.map((player) => (
        <PlayerComponent
          isActive={player.id === props.currentPlayerId}
          key={player.name}
          player={player}
        />
      ))}
    </div>
  );
};
