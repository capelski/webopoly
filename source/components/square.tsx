import React from 'react';
import { PropertyType, SquareType } from '../enums';
import { currencySymbol, houseSymbol } from '../parameters';
import { Player, Square } from '../types';

interface SquareComponentProps {
  owner?: Player;
  playersInSquare: Player[];
  square: Square;
}

export const SquareComponent: React.FC<SquareComponentProps> = (props) => {
  const { color, textColor } =
    props.square.type === SquareType.property && props.square.propertyType === PropertyType.street
      ? props.square
      : { color: undefined, textColor: undefined };

  return (
    <div
      onClick={() => {}}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #ccc',
      }}
    >
      <div
        style={{
          borderRight: '1px solid #ccc',
          fontSize: 22,
          width: '20%',
          height: '100%',
          textAlign: 'center',
        }}
      >
        {props.playersInSquare.map((p) => (
          <span
            key={p.name}
            style={{
              color: 'transparent',
              textShadow: `0 0 0 ${p.color}`,
            }}
          >
            👤
          </span>
        ))}
      </div>

      <div
        style={{
          backgroundColor: color,
          color: textColor,
          fontSize: 24,
          width: props.square.type === SquareType.property ? '50%' : '80%',
          height: '100%',
          paddingLeft: 4,
        }}
      >
        {props.square.type === SquareType.chest ? (
          <span>☘️&nbsp;</span>
        ) : props.square.type === SquareType.go ? (
          <span>⏩&nbsp;</span>
        ) : props.square.type === SquareType.parking ? (
          <span>🅿️&nbsp;</span>
        ) : props.square.type === SquareType.tax ? (
          <span>💰&nbsp;</span>
        ) : props.square.type === SquareType.goToJail ? (
          <span>🚔&nbsp;</span>
        ) : props.square.type === SquareType.jail ? (
          <span>⚖️&nbsp;</span>
        ) : props.square.type === SquareType.property ? (
          props.square.propertyType === PropertyType.power ? (
            <span>🔌&nbsp;</span>
          ) : props.square.propertyType === PropertyType.station ? (
            <span>🚂&nbsp;</span>
          ) : undefined
        ) : undefined}
        {props.square.name}
      </div>

      {props.square.type === SquareType.property && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: color,
            color: textColor,
            fontSize: 18,
            width: '30%',
            height: '100%',
            paddingRight: 4,
          }}
        >
          {props.owner && (
            <span
              style={{
                color: 'transparent',
                textShadow: `0 0 0 ${props.owner.color}`,
              }}
            >
              👤
            </span>
          )}
          {props.square.propertyType === PropertyType.street && (
            <span>{houseSymbol}&nbsp;0&nbsp;</span>
          )}
          {currencySymbol}
          {props.square.price}
        </div>
      )}
    </div>
  );
};
