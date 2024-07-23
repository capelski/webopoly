import { Player } from '@webopoly/core';
import React from 'react';
import { PlayerComponent } from './player';

interface PlayersProps {
  currentPlayerId: Player['id'];
  players: Player[];
  windowPlayerId: Player['id'];
}

export const Players: React.FC<PlayersProps> = (props) => {
  return (
    <div style={{ fontSize: 24, padding: 8 }}>
      {props.players.map((player) => (
        <PlayerComponent
          isActive={player.id === props.currentPlayerId}
          key={player.name}
          player={player}
          windowPlayerId={props.windowPlayerId}
        />
      ))}
    </div>
  );
};
