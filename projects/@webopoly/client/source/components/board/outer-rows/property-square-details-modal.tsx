import {
  canBuildHouse,
  canClearMortgage,
  canMortgage,
  canSellHouse,
  Game,
  GamePhase,
  GameUpdate,
  GameUpdateType,
  getCurrentPlayer,
  Player,
  PropertySquare,
  PropertyType,
  SquareModalType,
} from '@webopoly/core';
import React from 'react';
import {
  buyOfferSymbol,
  clearMortgageSymbol,
  houseSymbol,
  mortgageSymbol,
  sellHouseSymbol,
  sellOfferSymbol,
} from '../../../parameters';
import { Button } from '../../common/button';
import { Modal } from '../../common/modal';
import { SquareDetails } from '../../common/square-details';

interface PropertySquareDetailsModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: PropertySquare;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}

export const PropertySquareDetailsModal: React.FC<PropertySquareDetailsModalProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <Modal
      closeHandler={() => {
        props.setSquareModalType(undefined);
      }}
      inset="5% 20px"
    >
      <SquareDetails game={props.game} square={props.square} />

      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <div>
          <Button
            disabled={!canMortgage(props.game, props.square.id, props.windowPlayerId)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.triggerUpdate({ type: GameUpdateType.mortgage, squareId: props.square.id });
            }}
          >
            {mortgageSymbol} Mortgage
          </Button>

          <Button
            disabled={!canClearMortgage(props.game, props.square.id, props.windowPlayerId)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.triggerUpdate({
                type: GameUpdateType.clearMortgage,
                squareId: props.square.id,
              });
            }}
          >
            {clearMortgageSymbol} Clear mortgage
          </Button>
        </div>

        {props.square.propertyType === PropertyType.street && (
          <div>
            <Button
              disabled={!canBuildHouse(props.game, props.square.id, props.windowPlayerId)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.triggerUpdate({ type: GameUpdateType.buildHouse, squareId: props.square.id });
              }}
            >
              {houseSymbol} Build house
            </Button>

            <Button
              disabled={!canSellHouse(props.game, props.square.id, props.windowPlayerId)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.triggerUpdate({ type: GameUpdateType.sellHouse, squareId: props.square.id });
              }}
            >
              {sellHouseSymbol} Sell house
            </Button>
          </div>
        )}

        <div>
          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.windowPlayerId === props.square.ownerId ||
              props.windowPlayerId !== currentPlayer.id
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.buyOffer);
            }}
          >
            {buyOfferSymbol} Buy offer
          </Button>

          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.windowPlayerId !== props.square.ownerId ||
              props.windowPlayerId !== currentPlayer.id
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.sellOffer);
            }}
          >
            {sellOfferSymbol} Sell offer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
