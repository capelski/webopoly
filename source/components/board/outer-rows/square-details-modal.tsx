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
      inset="5% 20px"
    >
      <SquareDetails game={props.game} square={props.square} />

      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <div>
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
          <div>
            <Button
              disabled={
                (props.game.phase !== GamePhase.play && props.game.phase !== GamePhase.rollDice) ||
                !canBuildHouse(props.game, props.square, currentPlayer)
              }
              onClick={() => {
                if (
                  props.square.propertyType !== PropertyType.street ||
                  (props.game.phase !== GamePhase.play &&
                    props.game.phase !== GamePhase.rollDice) ||
                  !canBuildHouse(props.game, props.square, currentPlayer)
                ) {
                  return;
                }

                props.setSquareModalType(undefined);
                props.updateGame(triggerBuildHouse(props.game, props.square));
              }}
            >
              {houseSymbol} Build house
            </Button>

            <Button
              disabled={
                (props.game.phase !== GamePhase.liquidation &&
                  props.game.phase !== GamePhase.play &&
                  props.game.phase !== GamePhase.rollDice) ||
                !canSellHouse(props.game, props.square, currentPlayer)
              }
              onClick={() => {
                if (
                  props.square.propertyType !== PropertyType.street ||
                  (props.game.phase !== GamePhase.liquidation &&
                    props.game.phase !== GamePhase.play &&
                    props.game.phase !== GamePhase.rollDice) ||
                  !canSellHouse(props.game, props.square, currentPlayer)
                ) {
                  return;
                }

                props.setSquareModalType(undefined);
                props.updateGame(triggerSellHouse(props.game, props.square));
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
              currentPlayer.id === props.square.ownerId
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
              currentPlayer.id !== props.square.ownerId
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
