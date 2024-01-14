import React from 'react';
import { GamePhase, PropertyType } from '../enums';
import {
  canBuildHouse,
  canClearMortgage,
  canMortgage,
  canSellHouse,
  getBuildHouseAmount,
  getClearMortgageAmount,
  getCurrentPlayer,
  getMortgageAmount,
  getSellHouseAmount,
} from '../logic';
import { currencySymbol } from '../parameters';
import {
  triggerBuildHouse,
  triggerClearMortgage,
  triggerMortgage,
  triggerSellHouse,
} from '../triggers';
import { Game, PropertySquare } from '../types';
import { Button } from './button';
import { Modal } from './modal';

export type SquareModal = 'none' | 'options';

interface SquareOptionsModalProps {
  game: Game;
  setSquareModal: (squareModal: SquareModal) => void;
  square: PropertySquare;
  squareModal: SquareModal;
  updateGame: (game: Game) => void;
}

export const SquareOptionsModal: React.FC<SquareOptionsModalProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <Modal>
      <div style={{ marginBottom: 16 }}>
        <Button
          disabled={
            props.game.gamePhase === GamePhase.rollDice ||
            !canMortgage(props.square, currentPlayer.id)
          }
          onClick={() => {
            props.setSquareModal('none');
            props.updateGame(triggerMortgage(props.game, props.square.id));
          }}
        >
          Mortgage ({currencySymbol}
          {getMortgageAmount(props.square)})
        </Button>

        <Button
          disabled={
            props.game.gamePhase === GamePhase.rollDice ||
            !canClearMortgage(props.square, currentPlayer)
          }
          onClick={() => {
            props.setSquareModal('none');
            props.updateGame(triggerClearMortgage(props.game, props.square.id));
          }}
        >
          Clear mortgage ({currencySymbol}
          {getClearMortgageAmount(props.square)})
        </Button>
      </div>

      {props.square.propertyType === PropertyType.street && (
        <div style={{ marginBottom: 16 }}>
          <Button
            disabled={
              props.game.gamePhase === GamePhase.rollDice ||
              !canBuildHouse(props.game, props.square, currentPlayer)
            }
            onClick={() => {
              props.setSquareModal('none');
              props.updateGame(triggerBuildHouse(props.game, props.square.id));
            }}
          >
            Build house ({currencySymbol}
            {getBuildHouseAmount(props.square)})
          </Button>

          <Button
            disabled={
              props.game.gamePhase === GamePhase.rollDice ||
              !canSellHouse(props.game, props.square, currentPlayer)
            }
            onClick={() => {
              props.setSquareModal('none');
              props.updateGame(triggerSellHouse(props.game, props.square.id));
            }}
          >
            Sell house ({currencySymbol}
            {getSellHouseAmount(props.square)})
          </Button>
        </div>
      )}

      <Button
        onClick={() => {
          props.setSquareModal('none');
        }}
      >
        Cancel
      </Button>
    </Modal>
  );
};
