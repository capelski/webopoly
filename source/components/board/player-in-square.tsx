import React from 'react';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';

export type PlayerInSquareProps = {
  offset: number;
  player: Player;
  rotate: number;
};

export const PlayerInSquare: React.FC<PlayerInSquareProps> = (props) => {
  return (
    <div
      key={props.player.id}
      style={{
        left: `${20 + props.offset * 10}%`,
        position: 'absolute',
        transform: `rotate(${props.rotate}deg)`,
      }}
    >
      <PlayerAvatar player={props.player} />
    </div>
  );
};
