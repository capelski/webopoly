import {
  canBuyProperty,
  canLiquidateBuyProperty,
  canRejectProperty,
  GameUpdateType,
  getCurrentPlayer,
  getSquareById,
  PromptType,
  SquareType,
} from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { SquareDetails } from '../common/square-details';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const BuyPropertyPrompt: PromptInterface<PromptType.buyProperty> = (props) => {
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
                props.triggerUpdate({ type: GameUpdateType.buyProperty });
              }}
              style={{ flexBasis: 1, flexGrow: 1, textAlign: 'center' }}
            >
              Buy
            </Button>

            <Button
              disabled={!canRejectProperty(props.game, props.windowPlayerId)}
              onClick={() => {
                props.triggerUpdate({ type: GameUpdateType.buyPropertyReject });
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
                props.triggerUpdate({ type: GameUpdateType.buyPropertyLiquidation });
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
