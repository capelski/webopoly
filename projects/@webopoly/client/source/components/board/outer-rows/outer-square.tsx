import {
  canToggleTradeSelection,
  Game,
  GamePhase,
  GameUpdate,
  GameUpdateType,
  getCurrentPlayer,
  getPlayerById,
  isSelectedForTrade,
  Player,
  PropertyStatus,
  PropertyType,
  Square,
  SquareModalType,
  SquareType,
} from '@webopoly/core';
import React, { CSSProperties, useState } from 'react';
import { PlayerInSquare } from '../player-in-square';
import { squaresRotation } from '../squares-rotation';
import { OtherSquareDetailsModal } from './other-square-details-modal';
import { PropertySquareDetailsModal } from './property-square-details-modal';
import { SquareIcon } from './square-icon';
import { SquareOfferModal } from './square-offer-modal';
import { streetsColorMap } from './street-colors-map';

export type OuterSquareProps = {
  game: Game;
  isLandscape: boolean;
  square: Square;
  style?: CSSProperties;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
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

  const isTradeable = canToggleTradeSelection(props.game, props.square.id, props.windowPlayerId);
  const isSelected =
    props.game.phase === GamePhase.trade &&
    props.square.type === SquareType.property &&
    isSelectedForTrade(props.game, props.square);

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
        if (props.game.phase === GamePhase.trade) {
          if (isTradeable) {
            props.triggerUpdate({
              type: GameUpdateType.toggleTradeSelection,
              squareId: props.square.id,
            });
          }
        } else {
          if (props.square.type === SquareType.property) {
            setSquareModalType(SquareModalType.propertyDetails);
          } else {
            setSquareModalType(SquareModalType.otherDetails);
          }
        }
      }}
      style={{
        /* Sizing */
        flexBasis: 1,
        flexGrow: 1,
        /* Styling */
        alignItems: 'center',
        backgroundColor: owner && isSelected ? owner.color : backgroundColor,
        borderBottom: '1px solid #aaa',
        borderRight: '1px solid #aaa',
        boxSizing: 'border-box',
        cursor: props.game.phase !== GamePhase.trade || isTradeable ? 'pointer' : undefined,
        display: 'flex',
        fontSize: props.isLandscape ? `${props.zoom * 4}dvh` : `${props.zoom * 4}dvw`,
        justifyContent: 'center',
        opacity: props.game.phase !== GamePhase.trade || isTradeable ? undefined : 0.5,
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
              triggerUpdate={props.triggerUpdate}
              windowPlayerId={props.windowPlayerId}
            />
          )}

          {(squareModalType === SquareModalType.buyOffer ||
            squareModalType === SquareModalType.sellOffer) && (
            <SquareOfferModal
              game={props.game}
              setSquareModalType={setSquareModalType}
              square={props.square}
              squareModalType={squareModalType}
              triggerUpdate={props.triggerUpdate}
              windowPlayerId={props.windowPlayerId}
            />
          )}

          {props.square.ownerId !== undefined && owner && (
            <div
              style={{
                border: `3px solid ${owner.color}`,
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

      <SquareIcon game={props.game} rotate={true} square={props.square} />

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
