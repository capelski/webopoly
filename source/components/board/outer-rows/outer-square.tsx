import React, { CSSProperties, useState } from 'react';
import { PropertyStatus, PropertyType, SquareModalType, SquareType } from '../../../enums';
import { getPlayerById } from '../../../logic';
import { Game, Square } from '../../../types';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { SquareDetailsModal } from './square-details-modal';
import { SquareIcon } from './square-icon';
import { SquareOfferModal } from './square-offer-modal';
import { streetsColorMap } from './street-colors-map';

export type OuterSquareProps = {
  game: Game;
  isDesktop: boolean;
  square: Square;
  style?: CSSProperties;
  updateGame: (game: Game) => void;
};

export const OuterSquare: React.FC<OuterSquareProps> = (props) => {
  const [squareModalType, setSquareModalType] = useState<SquareModalType | undefined>();

  const backgroundColor =
    props.square.type === SquareType.property
      ? props.square.status === PropertyStatus.mortgaged
        ? 'lightgrey'
        : props.square.propertyType === PropertyType.street
        ? streetsColorMap[props.square.neighborhood].backgroundColor
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
              setSquareModalType(SquareModalType.details);
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
          {squareModalType === SquareModalType.details && (
            <SquareDetailsModal
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
              />
            </div>
          )}
        </React.Fragment>
      )}

      <SquareIcon rotate={true} square={props.square} />

      {props.square.type === SquareType.jail
        ? props.game.players
            .filter((player) => player.isInJail)
            .map((player, index) => (
              <PlayerInSquare
                isActive={player.id === props.game.currentPlayerId}
                key={index}
                offset={index}
                player={player}
                rotate={squaresRotation[11]}
              />
            ))
        : undefined}
    </div>
  );
};
