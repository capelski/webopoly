import {
  canBuyProperty,
  canLiquidateBuyProperty,
  canRejectProperty,
  Game,
  GamePhase,
  GameUpdateType,
  getCurrentPlayer,
  getSquareById,
  SquareType,
} from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { SquareDetails } from '../common/square-details';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const BuyPropertyPrompt: PromptInterface<Game<GamePhase.buyProperty>> = (props) => {
  const currentBuyer = getCurrentPlayer(props.game);
  const originalBuyer = getCurrentPlayer(props.game, { omitTurnConsiderations: true });

  const targetSquare = getSquareById(props.game, originalBuyer.squareId);
  if (targetSquare.type !== SquareType.property) {
    return undefined;
  }

  return (
    <React.Fragment>
      <SquareDetails game={props.game} square={targetSquare} />

      <Title>{currentBuyer.name}</Title>

      <React.Fragment>
        <div style={{ width: 250 }}>
          <div style={{ display: 'flex' }}>
            <Button
              disabled={!canBuyProperty(props.game, props.windowPlayerId)}
              onClick={() => {
                props.triggerUpdate({ type: GameUpdateType.buyPropertyAccept });
              }}
              style={{ flexBasis: 1, flexGrow: 1, textAlign: 'center' }}
            >
              Buy
            </Button>

            <Button
              autoClick={GameUpdateType.buyPropertyDecline}
              defaultAction={props.game.defaultAction}
              disabled={!canRejectProperty(props.game, props.windowPlayerId)}
              onClick={() => {
                props.triggerUpdate({ type: GameUpdateType.buyPropertyDecline });
              }}
              style={{ flexBasis: 1, flexGrow: 1, textAlign: 'center' }}
              type="delete"
            >
              Pass
            </Button>
          </div>

          <div style={{ display: 'flex' }}>
            <Button
              disabled={!canLiquidateBuyProperty(props.game, props.windowPlayerId)}
              onClick={() => {
                props.triggerUpdate({ type: GameUpdateType.buyingLiquidation });
              }}
              style={{ flexGrow: 1, textAlign: 'center' }}
              type="secondary"
            >
              Liquidate properties
            </Button>
          </div>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};
