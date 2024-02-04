import React from 'react';
import { OfferType, PromptType } from '../../enums';
import { getPlayerById, getSquareById } from '../../logic';
import { currencySymbol } from '../../parameters';
import { triggerAcceptOffer, triggerDeclineOffer } from '../../triggers';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const AnswerOfferPrompt: PromptInterface<PromptType.answerOffer> = (props) => {
  const player = getSquareById(props.game, props.game.prompt.playerId);
  const square = getSquareById(props.game, props.game.prompt.propertyId);
  const owner = getPlayerById(props.game, props.game.prompt.targetPlayerId);
  const isBuyingOffer = props.game.prompt.offerType === OfferType.buy;

  return (
    <div>
      <div>
        <span>{isBuyingOffer ? '⬅️' : '➡️'}</span>
        <span style={{ paddingLeft: 8 }}>{`${player.name} places ${currencySymbol}${
          props.game.prompt.amount
        } ${isBuyingOffer ? 'BUY' : 'SELL'} offer for ${square.name} to ${owner.name}`}</span>
      </div>
      <div>
        <Button
          onClick={() => {
            props.updateGame(triggerAcceptOffer(props.game));
          }}
        >
          Accept
        </Button>
        <Button
          onClick={() => {
            props.updateGame(triggerDeclineOffer(props.game));
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
