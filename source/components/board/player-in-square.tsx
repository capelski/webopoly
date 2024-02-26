import React from 'react';
import { zIndexes } from '../../parameters';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';

export type PlayerInSquareProps = {
  isActive: boolean;
  isDesktop: boolean;
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
        fontSize: props.isDesktop ? 32 : 24,
        position: 'absolute',
        transform: `rotate(${props.rotate}deg)`,
        zIndex: props.isActive ? zIndexes.activePlayer : undefined,
      }}
    >
      <PlayerAvatar isActive={props.isActive} player={props.player} />
    </div>
  );
};
