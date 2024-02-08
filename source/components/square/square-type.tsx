import React from 'react';
import { PropertyType, SquareType } from '../../enums';
import {
  chanceSymbol,
  communityChestSymbol,
  goSymbol,
  goToJailSymbol,
  jailSymbol,
  parkingSymbol,
  stationSymbol,
  taxSymbol,
} from '../../parameters';
import { Square } from '../../types';

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
  [SquareType.property]: undefined,
  [SquareType.tax]: taxSymbol,
};

export const SquareTypeComponent: React.FC<SquareTypeComponentProps> = (props) => {
  return props.square.type !== SquareType.property
    ? squareTypeMap[props.square.type]
    : props.square.propertyType === PropertyType.station
    ? stationSymbol
    : props.square.propertyType === PropertyType.utility
    ? props.square.icon
    : undefined;
};
