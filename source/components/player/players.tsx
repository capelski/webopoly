import React from 'react';
import { Player } from '../../types';
import { PlayerComponent } from './player';

interface PlayersProps {
  currentPlayerId: number;
  players: Player[];
}

export const Players: React.FC<PlayersProps> = (props) => {
  return (
    <div style={{ fontSize: 24, padding: 8 }}>
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
