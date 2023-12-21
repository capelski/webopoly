import React from 'react';
import { PropertyType, SquareType } from '../enums';
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

const squareTypeMap: { [key in SquareType | PropertyType]: string | undefined } = {
  [SquareType.chance]: chanceSymbol,
  [SquareType.communityChest]: communityChestSymbol,
  [SquareType.go]: goSymbol,
  [SquareType.goToJail]: goToJailSymbol,
  [SquareType.jail]: jailSymbol,
  [SquareType.parking]: parkingSymbol,
  [SquareType.property]: undefined, // Necessary for typing reasons
  [SquareType.tax]: taxSymbol,
  [PropertyType.power]: '🔌',
  [PropertyType.station]: '🚂',
  [PropertyType.street]: undefined,
};

export const SquareTypeComponent: React.FC<SquareTypeComponentProps> = (props) => {
  return props.square.type !== SquareType.property ? (
    <span>{squareTypeMap[props.square.type]}&nbsp;</span>
  ) : props.square.propertyType !== PropertyType.street ? (
    <span>{squareTypeMap[props.square.propertyType]}&nbsp;</span>
  ) : undefined;
};
