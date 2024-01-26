import React from 'react';
import { Player } from '../../types';

interface PlayerAvatarProps {
  isActive?: boolean;
  player: Player;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = (props) => {
  return (
    <span
      style={{
        color: 'transparent',
        textShadow: `0 0 0 ${props.player.color}`,
        border: props.isActive ? '1px solid goldenrod' : undefined,
      }}
    >
      👤
    </span>
  );
};
