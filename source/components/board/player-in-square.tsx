import React from 'react';
import { zIndexes } from '../../parameters';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';

export type PlayerInSquareProps = {
  isActive: boolean;
  offset: number;
  player: Player;
  rotate: number;
};

export const PlayerInSquare: React.FC<PlayerInSquareProps> = (props) => {
  return (
    <div
      key={props.player.id}
      style={{
        border: props.isActive ? '2px solid goldenrod' : undefined,
        left: `${20 + props.offset * 10}%`,
        position: 'absolute',
        transform: `rotate(${props.rotate}deg)`,
        zIndex: props.isActive ? zIndexes.activePlayer : undefined,
      }}
    >
      <PlayerAvatar player={props.player} />
    </div>
  );
};
