import React from 'react';
import { GamePhase, PropertyType, SquareModalType } from '../../../enums';
import {
  canBuildHouse,
  canClearMortgage,
  canMortgage,
  canSellHouse,
  getCurrentPlayer,
} from '../../../logic';
import {
  buyOfferSymbol,
  clearMortgageSymbol,
  houseSymbol,
  mortgageSymbol,
  sellHouseSymbol,
  sellOfferSymbol,
} from '../../../parameters';
import {
  triggerBuildHouse,
  triggerClearMortgage,
  triggerMortgage,
  triggerSellHouse,
} from '../../../triggers';
import { Game, PropertySquare } from '../../../types';
import { Button } from '../../common/button';
import { Modal } from '../../common/modal';
import { SquareDetails } from '../../common/square-details';

interface SquareDetailsModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: PropertySquare;
  updateGame: (game: Game) => void;
}

export const SquareDetailsModal: React.FC<SquareDetailsModalProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <Modal
      closeHandler={() => {
        props.setSquareModalType(undefined);
      }}
      inset="10% 20px"
    >
      <SquareDetails game={props.game} square={props.square} />

      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            disabled={!canMortgage(props.square, currentPlayer.id)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerMortgage(props.game, props.square.id));
            }}
          >
            {mortgageSymbol} Mortgage
          </Button>

          <Button
            disabled={!canClearMortgage(props.square, currentPlayer)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerClearMortgage(props.game, props.square.id));
            }}
          >
            {clearMortgageSymbol} Clear mortgage
          </Button>
        </div>

        {props.square.propertyType === PropertyType.street && (
          <div style={{ marginBottom: 16 }}>
            <Button
              disabled={!canBuildHouse(props.game, props.square, currentPlayer)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.updateGame(triggerBuildHouse(props.game, props.square.id));
              }}
            >
              {houseSymbol} Build house
            </Button>

            <Button
              disabled={!canSellHouse(props.game, props.square, currentPlayer)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.updateGame(triggerSellHouse(props.game, props.square.id));
              }}
            >
              {sellHouseSymbol} Sell house
            </Button>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.game.currentPlayerId === props.square.ownerId
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.placeOffer);
            }}
          >
            {buyOfferSymbol} Buy offer
          </Button>

          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.game.currentPlayerId !== props.square.ownerId
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.placeOffer);
            }}
          >
            {sellOfferSymbol} Sell offer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
