import React from 'react';
import { PromptType, SquareType } from '../../enums';
import { getCurrentPlayer, getPlayerById, getSquareById } from '../../logic';
import {
  triggerBuyProperty,
  triggerBuyPropertyLiquidation,
  triggerRejectProperty,
} from '../../triggers';
import { Button } from '../common/button';
import { SquareDetails } from '../common/square-details';
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
      <h4>{currentBuyer.name}</h4>

      <SquareDetails game={props.game} square={targetSquare} />

      <div>
        <Button
          disabled={currentBuyer.money < targetSquare.price}
          onClick={() => {
            props.updateGame(
              triggerBuyProperty(props.game, targetSquare, props.game.prompt.currentBuyerId),
            );
          }}
          style={{ marginTop: 8 }}
        >
          Buy
        </Button>

        <Button
          disabled={currentBuyer.money >= targetSquare.price}
          onClick={() => {
            props.updateGame(triggerBuyPropertyLiquidation(props.game));
          }}
          style={{ marginTop: 8 }}
        >
          Liquidate properties
        </Button>

        <Button
          onClick={() => {
            props.updateGame(triggerRejectProperty(props.game));
          }}
          style={{ marginTop: 8 }}
        >
          Pass
        </Button>
      </div>
    </React.Fragment>
  );
};
