import React from 'react';
import { PlayerStatus } from '../../enums';
import { currencySymbol, getOutJailSymbol } from '../../parameters';
import { Player } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';

interface PlayerComponentProps {
  isActive: boolean;
  player: Player;
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
