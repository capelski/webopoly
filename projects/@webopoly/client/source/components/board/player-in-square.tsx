import { Player, PlayerStatus } from '@webopoly/core';
import React from 'react';
import { zIndexes } from '../../parameters';
import { PlayerAvatar } from '../common/player-avatar';

export type PlayerInSquareProps = {
  isActive: boolean;
  isLandscape: boolean;
  offset: number;
  player: Player;
  rotate: number;
  zoom: number;
};

export const PlayerInSquare: React.FC<PlayerInSquareProps> = (props) => {
  return props.player.status === PlayerStatus.bankrupt ? undefined : (
    <div
      key={props.player.id}
      style={{
        left: `${20 + props.offset * 10}%`,
        fontSize: props.isLandscape ? `${props.zoom * 6}dvh` : `${props.zoom * 6}dvw`,
        position: 'absolute',
        transform: `rotate(${props.rotate}deg)`,
        zIndex: props.isActive ? zIndexes.activePlayer : undefined,
      }}
    >
      <PlayerAvatar isActive={props.isActive} player={props.player} />
    </div>
  );
};
