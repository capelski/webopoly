import React from 'react';
import { PropertyType, SquareType } from '../enums';
import { Player, Square } from '../types';

interface SquareComponentProps {
  playersInSquare: Player[];
  square: Square;
}

export const SquareComponent: React.FC<SquareComponentProps> = (props) => {
  return (
    <div
      onClick={() => {}}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 24,
      }}
    >
      <span
        style={{
          backgroundColor:
            props.square.type === SquareType.property &&
            props.square.propertyType === PropertyType.street
              ? props.square.group
              : undefined,
        }}
      >
        {props.square.type === SquareType.chest ? (
          <span>☘️</span>
        ) : props.square.type === SquareType.go ? (
          <span>⏩</span>
        ) : props.square.type === SquareType.parking ? (
          <span>🅿️</span>
        ) : props.square.type === SquareType.tax ? (
          <span>💰</span>
        ) : props.square.type === SquareType.goToJail ? (
          <span>🚔</span>
        ) : props.square.type === SquareType.jail ? (
          <span>⚖️</span>
        ) : props.square.type === SquareType.property ? (
          props.square.propertyType === PropertyType.street ? (
            <span>🏠</span>
          ) : props.square.propertyType === PropertyType.station ? (
            <span>🚂</span>
          ) : (
            <span>🔌</span>
          )
        ) : undefined}
      </span>

      <span style={{ paddingLeft: 8 }}>{props.square.name}</span>

      {props.square.type === SquareType.property && (
        <span style={{ paddingLeft: 8 }}>(${props.square.price})</span>
      )}

      {props.playersInSquare.map((p) => (
        <span
          key={p.name}
          style={{
            color: 'transparent',
            textShadow: `0 0 0 ${p.color}`,
            paddingLeft: 8,
          }}
        >
          👤
        </span>
      ))}
    </div>
  );
};
