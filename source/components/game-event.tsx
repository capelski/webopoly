import React from 'react';
import { GameEventType } from '../enums';
import {
  chanceSymbol,
  communityChestSymbol,
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

const GameEventTypeMap: { [key in GameEventType]: string } = {
  [GameEventType.bankruptcy]: '🧨',
  [GameEventType.buyProperty]: '💵',
  [GameEventType.chance]: chanceSymbol,
  [GameEventType.communityChest]: communityChestSymbol,
  [GameEventType.endTurn]: '⏰',
  [GameEventType.freeParking]: parkingSymbol,
  [GameEventType.getsOutOfJail]: '🎉',
  [GameEventType.goToJail]: goToJailSymbol,
  [GameEventType.passGo]: goSymbol,
  [GameEventType.payRent]: '🚀',
  [GameEventType.payTax]: taxSymbol,
  [GameEventType.playerWins]: '🏆',
  [GameEventType.remainsInJail]: jailSymbol,
  [GameEventType.rollDice]: diceSymbol,
};

export const GameEventComponent: React.FC<GameEventComponentProps> = (props) => {
  return (
    <div>
      <span>{GameEventTypeMap[props.event.type]}</span>
      <span style={{ paddingLeft: 8 }}>{props.event.description}</span>
    </div>
  );
};
