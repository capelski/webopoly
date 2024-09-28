import { Game, PropertyStatus, PropertyType, Square, SquareType } from '@webopoly/core';
import React from 'react';
import {
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailSymbol,
  parkingSymbol,
  stationSymbol,
  surpriseSymbol,
  taxSymbol,
} from '../../../parameters';
import { squaresRotation } from '../squares-rotation';

interface SquareIconProps {
  game?: Game<any>;
  rotate?: boolean;
  square: Square;
}

const squareIconMap: { [key in SquareType]: React.ReactNode } = {
  [SquareType.go]: goSymbol,
  [SquareType.goToJail]: goToJailSymbol,
  [SquareType.jail]: jailSymbol,
  [SquareType.parking]: parkingSymbol,
  [SquareType.property]: undefined,
  [SquareType.surprise]: surpriseSymbol,
  [SquareType.tax]: taxSymbol,
};

export const SquareIcon: React.FC<SquareIconProps> = (props) => {
  return (
    <span
      style={{
        display: 'inline-block',
        transform: props.rotate ? `rotate(${squaresRotation[props.square.id]}deg)` : undefined,
        ...(props.square.type === SquareType.property &&
        props.square.status === PropertyStatus.mortgaged
          ? {
              color: 'transparent',
              textShadow: 'white 0 0 0',
            }
          : undefined),
      }}
    >
      {props.square.type !== SquareType.property
        ? props.square.type === SquareType.parking && props.game?.centerPot
          ? props.game.centerPot
          : squareIconMap[props.square.type]
        : props.square.propertyType === PropertyType.station
        ? stationSymbol
        : props.square.propertyType === PropertyType.utility
        ? props.square.icon
        : props.square.houses > 0
        ? houseSymbol
        : undefined}
    </span>
  );
};
