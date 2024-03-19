import React from 'react';
import { currencySymbol, Player, PlayerStatus } from '../../../../core';
import { getOutJailSymbol } from '../../parameters';
import { PlayerAvatar } from '../common/player-avatar';

interface PlayerComponentProps {
  isActive: boolean;
  player: Player;
  windowPlayerId: Player['id'];
}

export const PlayerComponent: React.FC<PlayerComponentProps> = (props) => {
  const isBankrupt = props.player.status === PlayerStatus.bankrupt;

  return (
    <div
      style={{
        fontWeight: props.isActive ? 'bold' : undefined,
        fontStyle: isBankrupt ? 'italic' : undefined,
      }}
    >
      <PlayerAvatar isActive={props.isActive} player={props.player} />
      <span style={{ paddingLeft: 8, textDecoration: isBankrupt ? 'line-through' : undefined }}>
        {props.player.name}
        {props.windowPlayerId === props.player.id ? ' (You)' : ''}
      </span>
      <span style={{ paddingLeft: 8 }}>
        {currencySymbol} {props.player.money}
      </span>
      <span style={{ paddingLeft: 8 }}>🧱 {props.player.properties.length}</span>
      <span style={{ paddingLeft: 8 }}>
        {getOutJailSymbol} {props.player.getOutOfJail}
      </span>
    </div>
  );
};
