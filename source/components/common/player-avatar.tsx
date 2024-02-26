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
        animation: props.isActive ? 'glow 1.5s infinite' : undefined,
        color: 'transparent',
        textShadow: `0 0 0 ${props.player.color}`,
      }}
    >
      👤
    </span>
  );
};
