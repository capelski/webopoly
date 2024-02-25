import React, { useState } from 'react';
import { GamePhase, LiquidationReason } from '../../enums';
import { resumeBuyProperty, resumePendingPayment, triggerEndTurn } from '../../triggers';
import { Game } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';
import { Paragraph } from '../common/paragraph';

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
          <Paragraph>Are you sure you want to clear the game?</Paragraph>
          <div>
            <Button onClick={() => props.updateGame(undefined)} type="delete">
              Yes
            </Button>
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
            style={{
              animation:
                props.game.phase === GamePhase.play ? 'heart-beat-small 2s infinite' : undefined,
            }}
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
          >
            Resume
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setClearGameModal(true);
            }}
            type="delete"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
