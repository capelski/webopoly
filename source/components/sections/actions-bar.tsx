import React, { useState } from 'react';
import { EventType, GamePhase, SquareType } from '../../enums';
import { canBuyProperty, getCurrentPlayer, getCurrentSquare, hasEnoughMoney } from '../../logic';
import { jailFine } from '../../parameters';
import {
  triggerBuyProperty,
  triggerCannotPayPrompt,
  triggerDiceRoll,
  triggerEndTurn,
  triggerExpense,
  triggerLastTurnInJail,
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

  const clearGameCloseHandler = () => setClearGameModal(false);

  return (
    <div style={{ paddingLeft: 8 }}>
      {clearGameModal && (
        <Modal closeHandler={clearGameCloseHandler}>
          <div>Are you sure you want to clear the game?</div>
          <div>
            <Button onClick={() => props.updateGame(undefined)}>Yes</Button>
            <Button onClick={clearGameCloseHandler}>No</Button>
          </div>
        </Modal>
      )}

      <Button
        disabled={props.game.phase !== GamePhase.rollDice}
        onClick={() => {
          if (props.game.phase === GamePhase.rollDice) {
            props.updateGame(triggerDiceRoll(props.game));
          }
        }}
        style={{ marginTop: 8 }}
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
        style={{ marginTop: 8 }}
      >
        Buy
      </Button>

      <Button
        disabled={props.game.phase !== GamePhase.play}
        onClick={() => {
          if (props.game.phase === GamePhase.play) {
            props.updateGame(triggerEndTurn(props.game));
          }
        }}
        style={{ marginTop: 8 }}
      >
        End turn
      </Button>

      <Button
        disabled={props.game.phase !== GamePhase.cannotPay}
        onClick={() => {
          if (props.game.phase !== GamePhase.cannotPay) {
            return;
          }

          const pendingEvent = props.game.pendingEvent;
          const amount =
            pendingEvent.type === EventType.turnInJail ? jailFine : pendingEvent.amount;
          const player = getCurrentPlayer(props.game);

          if (hasEnoughMoney(player, amount)) {
            let nextGame: Game;

            if (pendingEvent.type === EventType.expense) {
              nextGame = triggerExpense(props.game, pendingEvent);
            } else if (pendingEvent.type === EventType.turnInJail) {
              nextGame = triggerLastTurnInJail(props.game);
            } else {
              nextGame = triggerPayRent(props.game, pendingEvent);
            }

            props.updateGame(nextGame);
          } else {
            props.updateGame(triggerCannotPayPrompt(props.game, pendingEvent));
          }
        }}
        style={{ marginTop: 8 }}
      >
        Resume
      </Button>

      <Button
        onClick={() => {
          setClearGameModal(true);
        }}
        style={{ color: 'red', marginTop: 8 }}
      >
        Clear
      </Button>
    </div>
  );
};
