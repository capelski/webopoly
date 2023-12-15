import React from 'react';
import { GameEventType } from '../enums';
import { GameEvent } from '../types';

interface GameEventComponentProps {
  event: GameEvent;
}

export const GameEventComponent: React.FC<GameEventComponentProps> = (props) => {
  return (
    <div>
      <span>
        {props.event.type === GameEventType.buyProperty
          ? '💵'
          : props.event.type === GameEventType.endTurn
          ? '⏰'
          : props.event.type === GameEventType.startTurn
          ? '🎲'
          : props.event.type === GameEventType.passGo
          ? '⭐️'
          : props.event.type === GameEventType.payRent
          ? '🚀'
          : props.event.type === GameEventType.bankruptcy
          ? '🧨'
          : undefined}
      </span>
      <span style={{ paddingLeft: 8 }}>{props.event.description}</span>
    </div>
  );
};
