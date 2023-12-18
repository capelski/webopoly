import React from 'react';
import { GameEventType } from '../enums';
import { diceSymbol, goSymbol, taxSymbol } from '../parameters';
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
          ? diceSymbol
          : props.event.type === GameEventType.passGo
          ? goSymbol
          : props.event.type === GameEventType.payRent
          ? '🚀'
          : props.event.type === GameEventType.bankruptcy
          ? '🧨'
          : props.event.type === GameEventType.payTax
          ? taxSymbol
          : undefined}
      </span>
      <span style={{ paddingLeft: 8 }}>{props.event.description}</span>
    </div>
  );
};
