import React, { useState } from 'react';
import { SquareType } from '../enums';
import { canBuyProperty, diceToString, getCurrentPlayer, getCurrentSquare } from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { triggerBuyProperty, triggerDiceRoll, triggerEndTurn } from '../triggers';
import { Game } from '../types';
import { Button } from './common/button';
import { Modal } from './common/modal';

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
          disabled={!props.game.mustStartTurn || (props.game.mustStartTurn && !!props.game.prompt)}
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
          disabled={props.game.mustStartTurn || !!props.game.prompt}
          onClick={() => {
            props.updateGame(triggerEndTurn(props.game));
          }}
        >
          End turn
        </Button>

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
