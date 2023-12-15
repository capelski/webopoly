import React from 'react';
import { PlayerStatus } from '../enums';
import { Player } from '../types';

interface PlayerComponentProps {
  isActive: boolean;
  player: Player;
}

export const PlayerComponent: React.FC<PlayerComponentProps> = (props) => {
  const isBankrupt = props.player.status === PlayerStatus.bankrupt;

  return (
    <div
      style={{
        border: props.isActive ? '2px solid goldenrod' : undefined,
        fontStyle: isBankrupt ? 'italic' : undefined,
      }}
    >
      <span style={{ color: 'transparent', textShadow: `0 0 0 ${props.player.color}` }}>👤</span>
      <span style={{ paddingLeft: 8, textDecoration: isBankrupt ? 'line-through' : undefined }}>
        {props.player.name}
      </span>
      <span style={{ paddingLeft: 8 }}>💲 {props.player.money}</span>
      <span style={{ paddingLeft: 8 }}>🏠 {props.player.properties.length}</span>
    </div>
  );
};
