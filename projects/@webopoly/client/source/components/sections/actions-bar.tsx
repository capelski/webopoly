import React, { useState } from 'react';
import {
  canCancelTrade,
  canEndTurn,
  canResume,
  canStartTrade,
  canTriggerTradeOffer,
  Game,
  GamePhase,
  GameUpdate,
  GameUpdateType,
  Player,
} from '../../../../core';
import { Button } from '../common/button';
import { Modal } from '../common/modal';
import { Paragraph } from '../common/paragraph';

interface ActionsBarProps {
  exitGame: () => void;
  game: Game;
  setZoom: (zoom: number) => void;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
  zoom: number;
}

export const ActionsBar: React.FC<ActionsBarProps> = (props) => {
  const [exitGameModal, setExitGameModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const exitGameCloseHandler = () => setExitGameModal(false);
  const settingsCloseHandler = () => setSettingsModal(false);

  const canEnd = canEndTurn(props.game, props.windowPlayerId);

  return (
    <div style={{ paddingLeft: 8 }}>
      {exitGameModal && (
        <Modal closeHandler={exitGameCloseHandler}>
          <Paragraph>Are you sure you want to exit the game?</Paragraph>
          <div>
            <Button onClick={props.exitGame} type="delete">
              Yes
            </Button>
            <Button onClick={exitGameCloseHandler}>No</Button>
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
              setExitGameModal(true);
            }}
            type="delete"
            style={{ marginTop: 24 }}
          >
            Exit
          </Button>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            disabled={!canEnd}
            onClick={() => {
              props.triggerUpdate({ type: GameUpdateType.endTurn });
            }}
            style={{
              animation: canEnd ? 'heart-beat-small 2s infinite' : undefined,
            }}
          >
            End turn
          </Button>

          {props.game.phase === GamePhase.trade ? (
            <React.Fragment>
              <Button
                disabled={!canTriggerTradeOffer(props.game, props.windowPlayerId)}
                onClick={() => {
                  props.triggerUpdate({ type: GameUpdateType.tradeOffer });
                }}
              >
                Continue
              </Button>

              <Button
                disabled={!canCancelTrade(props.game, props.windowPlayerId)}
                onClick={() => {
                  props.triggerUpdate({ type: GameUpdateType.cancelTrade });
                }}
                type="secondary"
              >
                Cancel
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                disabled={!canStartTrade(props.game, props.windowPlayerId)}
                onClick={() => {
                  props.triggerUpdate({ type: GameUpdateType.startTrade });
                }}
              >
                Trade
              </Button>

              <Button
                disabled={!canResume(props.game, props.windowPlayerId)}
                onClick={() => {
                  props.triggerUpdate({ type: GameUpdateType.resume });
                }}
              >
                Resume
              </Button>
            </React.Fragment>
          )}
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
