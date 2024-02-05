import React from 'react';
import { GamePhase, PropertyType, SquareModalType } from '../../enums';
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
} from '../../logic';
import { currencySymbol } from '../../parameters';
import {
  triggerBuildHouse,
  triggerClearMortgage,
  triggerMortgage,
  triggerSellHouse,
} from '../../triggers';
import { Game, PropertySquare } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

interface SquareMenuModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: PropertySquare;
  updateGame: (game: Game) => void;
}

export const SquareMenuModal: React.FC<SquareMenuModalProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <Modal>
      <h3>{props.square.name}</h3>
      <div style={{ marginBottom: 16 }}>
        <Button
          disabled={!canMortgage(props.square, currentPlayer.id)}
          onClick={() => {
            props.setSquareModalType(undefined);
            props.updateGame(triggerMortgage(props.game, props.square.id));
          }}
        >
          Mortgage ({currencySymbol}
          {getMortgageAmount(props.square)})
        </Button>

        <Button
          disabled={!canClearMortgage(props.square, currentPlayer)}
          onClick={() => {
            props.setSquareModalType(undefined);
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
            disabled={!canBuildHouse(props.game, props.square, currentPlayer)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerBuildHouse(props.game, props.square.id));
            }}
          >
            Build house ({currencySymbol}
            {getBuildHouseAmount(props.square)})
          </Button>

          <Button
            disabled={!canSellHouse(props.game, props.square, currentPlayer)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerSellHouse(props.game, props.square.id));
            }}
          >
            Sell house ({currencySymbol}
            {getSellHouseAmount(props.square)})
          </Button>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button
          disabled={
            props.game.phase === GamePhase.prompt ||
            !props.square.ownerId ||
            (props.square.propertyType === PropertyType.street && props.square.houses > 0)
          }
          onClick={() => {
            props.setSquareModalType(SquareModalType.placeOffer);
          }}
        >
          {props.game.currentPlayerId === props.square.ownerId ? 'Selling offer' : 'Buying offer'}
        </Button>
      </div>

      <Button
        onClick={() => {
          props.setSquareModalType(undefined);
        }}
      >
        Cancel
      </Button>
    </Modal>
  );
};
