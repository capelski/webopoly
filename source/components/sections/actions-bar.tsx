import React, { useState } from 'react';
import { GamePhase, LiquidationReason } from '../../enums';
import { resumeBuyProperty, resumePendingPayment, triggerEndTurn } from '../../triggers';
import { Game } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

interface ActionsBarProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const ActionsBar: React.FC<ActionsBarProps> = (props) => {
  const [clearGameModal, setClearGameModal] = useState(false);

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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
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
            disabled={props.game.phase !== GamePhase.liquidation}
            onClick={() => {
              if (props.game.phase !== GamePhase.liquidation) {
                return;
              }

              if (props.game.reason === LiquidationReason.buyProperty) {
                props.updateGame(resumeBuyProperty(props.game));
              } else {
                props.updateGame(resumePendingPayment(props.game));
              }
            }}
            style={{ marginTop: 8 }}
          >
            Resume
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setClearGameModal(true);
            }}
            style={{ color: 'red', marginTop: 8 }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
