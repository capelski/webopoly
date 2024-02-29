import React, { CSSProperties, useState } from 'react';
import { PropertyStatus, PropertyType, SquareModalType, SquareType } from '../../../enums';
import { getCurrentPlayer, getPlayerById } from '../../../logic';
import { Game, Square } from '../../../types';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { OtherSquareDetailsModal } from './other-square-details-modal copy';
import { PropertySquareDetailsModal } from './property-square-details-modal';
import { SquareIcon } from './square-icon';
import { SquareOfferModal } from './square-offer-modal';
import { streetsColorMap } from './street-colors-map';

export type OuterSquareProps = {
  game: Game;
  isLandscape: boolean;
  square: Square;
  style?: CSSProperties;
  updateGame: (game: Game) => void;
  zoom: number;
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

  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <div
      onClick={() => {
        if (props.square.type === SquareType.property) {
          setSquareModalType(SquareModalType.propertyDetails);
        } else {
          setSquareModalType(SquareModalType.otherDetails);
        }
      }}
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
        cursor: 'pointer',
        display: 'flex',
        fontSize: props.isLandscape ? `${props.zoom * 4}dvh` : `${props.zoom * 4}dvw`,
        justifyContent: 'center',
        position: 'relative',
        ...props.style,
      }}
    >
      {props.square.type === SquareType.property && (
        <React.Fragment>
          {squareModalType === SquareModalType.propertyDetails && (
            <PropertySquareDetailsModal
              game={props.game}
              setSquareModalType={setSquareModalType}
              square={props.square}
              updateGame={props.updateGame}
            />
          )}

          {(squareModalType === SquareModalType.buyOffer ||
            squareModalType === SquareModalType.sellOffer) && (
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

      {squareModalType === SquareModalType.otherDetails && (
        <OtherSquareDetailsModal
          game={props.game}
          setSquareModalType={setSquareModalType}
          square={props.square}
        />
      )}

      <SquareIcon rotate={true} square={props.square} />

      {props.square.type === SquareType.jail
        ? props.game.players
            .filter((player) => player.isInJail)
            .map((player, index) => (
              <PlayerInSquare
                isActive={player.id === currentPlayer.id}
                isLandscape={props.isLandscape}
                key={index}
                offset={index}
                player={player}
                rotate={squaresRotation[11]}
                zoom={props.zoom}
              />
            ))
        : undefined}
    </div>
  );
};
