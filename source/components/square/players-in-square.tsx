import React from 'react';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';

interface PlayersInSquareProps {
  currentPlayerId: number;
  players: Player[];
}

export const PlayersInSquare: React.FC<PlayersInSquareProps> = (props) => {
  return (
    <React.Fragment>
      {props.players.map((player) => (
        <PlayerAvatar
          isActive={props.currentPlayerId === player.id}
          key={player.name}
          player={player}
        />
      ))}
    </React.Fragment>
  );
};
