import React, { CSSProperties, useState } from 'react';
import {
  Neighborhood,
  PropertyStatus,
  PropertyType,
  SquareModalType,
  SquareType,
} from '../../../enums';
import { getPlayerById } from '../../../logic';
import { houseSymbol } from '../../../parameters';
import { Game, Square } from '../../../types';
import { SquareMenuModal } from '../../square/square-menu-modal';
import { SquareOfferModal } from '../../square/square-offer-modal';
import { SquareTypeComponent } from '../../square/square-type';
import { PlayerInSquare } from '../player-in-square';

export type OuterSquareProps = {
  game: Game;
  isDesktop: boolean;
  square: Square;
  style?: CSSProperties;
  updateGame: (game: Game) => void;
};

const streetsColorMap: { [group in Neighborhood]: string } = {
  [Neighborhood.brown]: 'brown',
  [Neighborhood.lightblue]: 'lightblue',
  [Neighborhood.pink]: 'pink',
  [Neighborhood.orange]: 'orange',
  [Neighborhood.red]: 'red',
  [Neighborhood.yellow]: 'yellow',
  [Neighborhood.green]: 'green',
  [Neighborhood.darkblue]: 'darkblue',
};

export const OuterSquare: React.FC<OuterSquareProps> = (props) => {
  const [squareModalType, setSquareModalType] = useState<SquareModalType | undefined>();

  const backgroundColor =
    props.square.type === SquareType.property
      ? props.square.status === PropertyStatus.mortgaged
        ? 'lightgrey'
        : props.square.propertyType === PropertyType.street
        ? streetsColorMap[props.square.neighborhood]
        : undefined
      : undefined;

  const owner =
    props.square.type === SquareType.property && props.square.ownerId !== undefined
      ? getPlayerById(props.game, props.square.ownerId)
      : undefined;

  const ownedPropertyBorders: CSSProperties = {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  };

  return (
    <div
      onClick={
        props.square.type === SquareType.property
          ? () => {
              setSquareModalType(SquareModalType.menu);
            }
          : undefined
      }
      style={{
        /* Sizing */
        flexBasis: 1,
        flexGrow: 1,
        /* Styling */
        alignItems: 'center',
        backgroundColor,
        borderBottom: '1px solid #aaa',
        borderRight: '1px solid #aaa',
        boxSizing: 'border-box',
        display: 'flex',
        fontSize: props.isDesktop ? 32 : 18,
        justifyContent: 'center',
        position: 'relative',
        ...props.style,
      }}
    >
      {props.square.type === SquareType.property && (
        <React.Fragment>
          {squareModalType === SquareModalType.menu && (
            <SquareMenuModal
              game={props.game}
              setSquareModalType={setSquareModalType}
              square={props.square}
              updateGame={props.updateGame}
            />
          )}

          {squareModalType === SquareModalType.placeOffer && (
            <SquareOfferModal
              game={props.game}
              setSquareModalType={setSquareModalType}
              square={props.square}
              squareModalType={squareModalType}
              updateGame={props.updateGame}
            />
          )}

          {props.square.ownerId !== undefined && (
            <div
              style={{
                border: `3px solid ${owner!.color}`,
                ...ownedPropertyBorders,
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  border: `1px solid white`,
                  display: 'flex',
                  justifyContent: 'center',
                  ...ownedPropertyBorders,
                }}
              >
                {props.square.propertyType === PropertyType.street && props.square.houses > 0 ? (
                  <span>{houseSymbol}</span>
                ) : undefined}
              </div>
            </div>
          )}
        </React.Fragment>
      )}

      <span
        style={
          props.square.type === SquareType.property &&
          props.square.status === PropertyStatus.mortgaged
            ? {
                color: 'transparent',
                textShadow: 'white 0 0 0',
              }
            : undefined
        }
      >
        <SquareTypeComponent square={props.square} />
      </span>

      {props.square.type === SquareType.jail
        ? props.game.players
            .filter((player) => player.isInJail)
            .map((player, index) => (
              <PlayerInSquare key={index} offset={index} player={player} rotate={225} />
            ))
        : undefined}
    </div>
  );
};
