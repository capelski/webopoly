import React, { useState } from 'react';
import { EventType, GamePhase, PromptType, SquareType } from '../../enums';
import {
  canBuyProperty,
  diceToString,
  getCurrentPlayer,
  getCurrentSquare,
  hasEnoughMoney,
} from '../../logic';
import { diceSymbol, jailFine, parkingSymbol } from '../../parameters';
import {
  triggerBuyProperty,
  triggerDiceRoll,
  triggerEndTurn,
  triggerExpense,
  triggerGetOutOfJail,
  triggerPayRent,
} from '../../triggers';
import { Game } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

interface ActionsBarProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const ActionsBar: React.FC<ActionsBarProps> = (props) => {
  const [clearGameModal, setClearGameModal] = useState(false);

  const currentPlayer = getCurrentPlayer(props.game);
  const currentSquare = getCurrentSquare(props.game);

  return (
    <div style={{ background: '#efefef', position: 'sticky', bottom: 0, padding: 8 }}>
      {clearGameModal && (
        <Modal>
          <div>Are you sure you want to clear the game?</div>
          <div>
            <Button onClick={() => props.updateGame(undefined)}>Yes</Button>
            <Button onClick={() => setClearGameModal(false)}>No</Button>
          </div>
        </Modal>
      )}

      <div>
        <span style={{ fontSize: 24, padding: '0 8px' }}>
          {diceSymbol} {diceToString(props.game.dice)}
        </span>
        <span style={{ fontSize: 24, padding: '0 8px' }}>
          {parkingSymbol} {props.game.centerPot}
        </span>
      </div>

      <div>
        <Button
          disabled={props.game.status !== GamePhase.rollDice}
          onClick={() => {
            props.updateGame(triggerDiceRoll(props.game));
          }}
        >
          Roll dice
        </Button>

        <Button
          onClick={() => {
            props.updateGame(triggerBuyProperty(props.game));
          }}
          disabled={
            currentSquare.type !== SquareType.property ||
            !canBuyProperty(currentSquare, currentPlayer!)
          }
        >
          Buy
        </Button>

        <Button
          disabled={props.game.status !== GamePhase.play}
          onClick={() => {
            props.updateGame(triggerEndTurn(props.game));
          }}
        >
          End turn
        </Button>

        {props.game.status === GamePhase.cannotPay && (
          <Button
            onClick={() => {
              const notification = props.game.pendingNotification!;
              const amount =
                notification.type === EventType.getOutOfJail ? jailFine : notification.amount;
              const player = getCurrentPlayer(props.game);

              if (hasEnoughMoney(player, amount)) {
                let nextGame: Game = {
                  ...props.game,
                  pendingNotification: undefined,
                  status: GamePhase.play,
                };

                if (notification.type === EventType.expense) {
                  nextGame = triggerExpense(nextGame, notification);
                } else if (notification.type === EventType.getOutOfJail) {
                  nextGame = triggerGetOutOfJail(nextGame, notification.medium);
                } else if (notification.type === EventType.payRent) {
                  nextGame = triggerPayRent(nextGame, notification);
                }

                props.updateGame(nextGame);
              } else {
                props.updateGame({
                  ...props.game,
                  status: {
                    type: PromptType.cannotPay,
                  },
                });
              }
            }}
          >
            Resume
          </Button>
        )}

        <div style={{ marginTop: 8 }}>
          <Button
            onClick={() => {
              setClearGameModal(true);
            }}
            style={{ color: 'red' }}
          >
            Clear game
          </Button>
        </div>
      </div>
    </div>
  );
};
