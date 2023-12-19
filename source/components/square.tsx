import React, { CSSProperties } from 'react';
import { Neighborhood, PropertyType, SquareType, TaxType } from '../enums';
import { isPlayerInJail } from '../logic';
import {
  currencySymbol,
  goToJailSymbol,
  houseSymbol,
  jailSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../parameters';
import { Player, Square } from '../types';
import { PlayerAvatar } from './player-avatar';
import { PlayersInSquare } from './players-in-square';

interface SquareComponentProps {
  owner?: Player;
  currentPlayerId: number;
  playersInSquare: Player[];
  square: Square;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
}

const streetsColorMap: { [group in Neighborhood]: CSSProperties } = {
  [Neighborhood.brown]: { backgroundColor: 'brown', color: 'white' },
  [Neighborhood.lightblue]: { backgroundColor: 'lightblue', color: 'black' },
  [Neighborhood.pink]: { backgroundColor: 'pink', color: 'black' },
  [Neighborhood.orange]: { backgroundColor: 'orange', color: 'white' },
  [Neighborhood.red]: { backgroundColor: 'red', color: 'white' },
  [Neighborhood.yellow]: { backgroundColor: 'yellow', color: 'black' },
  [Neighborhood.green]: { backgroundColor: 'green', color: 'white' },
  [Neighborhood.darkblue]: { backgroundColor: 'darkblue', color: 'white' },
};

export const SquareComponent: React.FC<SquareComponentProps> = (props) => {
  const { backgroundColor, color } =
    props.square.type === SquareType.property && props.square.propertyType === PropertyType.street
      ? streetsColorMap[props.square.neighborhood]
      : { backgroundColor: undefined, color: undefined };

  return (
    <div
      ref={props.rootRef}
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
        <PlayersInSquare
          currentPlayerId={props.currentPlayerId}
          players={props.playersInSquare.filter((p) => !isPlayerInJail(p))}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor,
          color,
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
          <span>{parkingSymbol}&nbsp;</span>
        ) : props.square.type === SquareType.tax ? (
          <span>{taxSymbol}&nbsp;</span>
        ) : props.square.type === SquareType.goToJail ? (
          <span>{goToJailSymbol}&nbsp;</span>
        ) : props.square.type === SquareType.jail ? (
          <span>{jailSymbol}&nbsp;</span>
        ) : props.square.type === SquareType.property ? (
          props.square.propertyType === PropertyType.power ? (
            <span>🔌&nbsp;</span>
          ) : props.square.propertyType === PropertyType.station ? (
            <span>🚂&nbsp;</span>
          ) : undefined
        ) : undefined}
        {props.square.name}
        {props.square.type === SquareType.go ? (
          <div
            style={{
              fontSize: 18,
              flexGrow: 1,
              textAlign: 'right',
              paddingRight: 4,
            }}
          >
            Collect {currencySymbol}
            {passGoMoney}
          </div>
        ) : props.square.type === SquareType.tax ? (
          <div
            style={{
              fontSize: 18,
              flexGrow: 1,
              textAlign: 'right',
              paddingRight: 4,
            }}
          >
            {props.square.taxType === TaxType.income
              ? `10% or ${currencySymbol}200`
              : `${currencySymbol}100`}
          </div>
        ) : props.square.type === SquareType.jail ? (
          <div
            style={{
              paddingLeft: 8,
            }}
          >
            <PlayersInSquare
              currentPlayerId={props.currentPlayerId}
              players={props.playersInSquare.filter(isPlayerInJail)}
            />
          </div>
        ) : undefined}
      </div>

      {props.square.type === SquareType.property && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor,
            color,
            fontSize: 18,
            width: '30%',
            height: '100%',
            paddingRight: 4,
          }}
        >
          {props.owner && <PlayerAvatar player={props.owner} />}
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
