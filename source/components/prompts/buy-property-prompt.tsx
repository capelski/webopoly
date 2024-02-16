import React from 'react';
import { PromptType, SquareType } from '../../enums';
import { getCurrentSquare, getPlayerById } from '../../logic';
import { triggerBuyProperty, triggerRejectProperty } from '../../triggers';
import { Button } from '../common/button';
import { SquareDetails } from '../common/square-details';
import { PromptInterface } from './prompt-interface';

export const BuyPropertyPrompt: PromptInterface<PromptType.buyProperty> = (props) => {
  const currentSquare = getCurrentSquare(props.game);

  if (currentSquare.type !== SquareType.property) {
    return undefined;
  }

  const currentBuyer = getPlayerById(props.game, props.game.prompt.currentBuyerId);

  return (
    <React.Fragment>
      <h4>{currentBuyer.name}</h4>

      <SquareDetails game={props.game} square={currentSquare} />

      <div>
        <Button
          disabled={currentBuyer.money < currentSquare.price}
          onClick={() => {
            props.updateGame(
              triggerBuyProperty(props.game, currentSquare, props.game.prompt.currentBuyerId),
            );
          }}
          style={{ marginTop: 8 }}
        >
          Buy
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
