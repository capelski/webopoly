import React, { useState } from 'react';
import { GamePhase, LiquidationReason } from '../../enums';
import { resumeBuyProperty, resumePendingPayment, triggerEndTurn } from '../../triggers';
import { Game } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';
import { Paragraph } from '../common/paragraph';

interface ActionsBarProps {
  game: Game;
  setZoom: (zoom: number) => void;
  updateGame: (game: Game | undefined) => void;
  zoom: number;
}

export const ActionsBar: React.FC<ActionsBarProps> = (props) => {
  const [clearGameModal, setClearGameModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const clearGameCloseHandler = () => setClearGameModal(false);
  const settingsCloseHandler = () => setSettingsModal(false);

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

      {settingsModal && (
        <Modal closeHandler={settingsCloseHandler}>
          <div>
            <Button
              onClick={() => {
                props.setZoom(props.zoom + 0.05);
              }}
              style={{ marginTop: 8 }}
            >
              Zoom in
            </Button>

            <Button
              onClick={() => {
                props.setZoom(props.zoom - 0.05);
              }}
              style={{ marginTop: 8 }}
            >
              Zoom out
            </Button>
          </div>
          <Button
            onClick={() => {
              setClearGameModal(true);
            }}
            type="delete"
            style={{ marginTop: 24 }}
          >
            Clear
          </Button>
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
              setSettingsModal(true);
            }}
            type="border"
          >
            ⚙️
          </Button>
        </div>
      </div>
    </div>
  );
};
