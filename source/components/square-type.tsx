import React from 'react';
import { SquareType } from '../enums';
import {
  chanceSymbol,
  communityChestSymbol,
  goSymbol,
  goToJailSymbol,
  jailSymbol,
  parkingSymbol,
  taxSymbol,
} from '../parameters';
import { Square } from '../types';

interface SquareTypeComponentProps {
  square: Square;
}

const squareTypeMap: { [key in SquareType]: React.ReactNode } = {
  [SquareType.chance]: chanceSymbol,
  [SquareType.communityChest]: communityChestSymbol,
  [SquareType.go]: goSymbol,
  [SquareType.goToJail]: goToJailSymbol,
  [SquareType.jail]: jailSymbol,
  [SquareType.parking]: parkingSymbol,
  [SquareType.station]: '🚂',
  [SquareType.street]: undefined,
  [SquareType.tax]: taxSymbol,
  [SquareType.utility]: '🔌',
};

export const SquareTypeComponent: React.FC<SquareTypeComponentProps> = (props) => {
  return props.square.type === SquareType.street ? undefined : (
    <span>{squareTypeMap[props.square.type]}&nbsp;</span>
  );
};
