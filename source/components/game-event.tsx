import React from 'react';
import { GameEventType } from '../enums';
import {
  diceSymbol,
  goSymbol,
  goToJailSymbol,
  jailSymbol,
  parkingSymbol,
  taxSymbol,
} from '../parameters';
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
          : props.event.type === GameEventType.rollDice
          ? diceSymbol
          : props.event.type === GameEventType.passGo
          ? goSymbol
          : props.event.type === GameEventType.payRent
          ? '🚀'
          : props.event.type === GameEventType.bankruptcy
          ? '🧨'
          : props.event.type === GameEventType.payTax
          ? taxSymbol
          : props.event.type === GameEventType.goToJail
          ? goToJailSymbol
          : props.event.type === GameEventType.getsOutOfJail
          ? '🎉'
          : props.event.type === GameEventType.remainsInJail
          ? jailSymbol
          : props.event.type === GameEventType.freeParking
          ? parkingSymbol
          : props.event.type === GameEventType.playerWins
          ? '🏆'
          : undefined}
      </span>
      <span style={{ paddingLeft: 8 }}>{props.event.description}</span>
    </div>
  );
};
