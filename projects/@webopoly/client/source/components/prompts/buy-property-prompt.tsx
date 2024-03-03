import React from 'react';
import {
  getCurrentPlayer,
  getPlayerById,
  getSquareById,
  PromptType,
  SquareType,
  triggerBuyProperty,
  triggerBuyPropertyLiquidation,
  triggerRejectProperty,
} from '../../../../core';
import { Button } from '../common/button';
import { SquareDetails } from '../common/square-details';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const BuyPropertyPrompt: PromptInterface<PromptType.buyProperty> = (props) => {
  const originalPlayer = getCurrentPlayer(props.game, { omitBuyPhase: true });
  const targetSquare = getSquareById(props.game, originalPlayer.squareId);

  if (targetSquare.type !== SquareType.property) {
    return undefined;
  }

  const currentBuyer = getPlayerById(props.game, props.game.prompt.currentBuyerId);

  return (
    <React.Fragment>
      <Title>{currentBuyer.name}</Title>

      <SquareDetails game={props.game} square={targetSquare} />

      <div style={{ width: 250 }}>
        <div style={{ display: 'flex' }}>
          <Button
            disabled={currentBuyer.money < targetSquare.price}
            onClick={() => {
              props.updateGame(
                triggerBuyProperty(props.game, targetSquare, props.game.prompt.currentBuyerId),
              );
            }}
            style={{ flexBasis: 1, flexGrow: 1, textAlign: 'center' }}
          >
            Buy
          </Button>

          <Button
            onClick={() => {
              props.updateGame(triggerRejectProperty(props.game));
            }}
            style={{ flexBasis: 1, flexGrow: 1, textAlign: 'center' }}
            type="delete"
          >
            Pass
          </Button>
        </div>

        <div style={{ display: 'flex' }}>
          <Button
            disabled={currentBuyer.money >= targetSquare.price}
            onClick={() => {
              props.updateGame(triggerBuyPropertyLiquidation(props.game));
            }}
            style={{ flexGrow: 1, textAlign: 'center' }}
            type="secondary"
          >
            Liquidate properties
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};
