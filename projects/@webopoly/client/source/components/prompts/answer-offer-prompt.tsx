import React from 'react';
import {
  canAnswerOffer,
  currencySymbol,
  GameUpdateType,
  getPlayerById,
  getSquareById,
  OfferType,
  PromptType,
} from '../../../../core';
import { buyOfferSymbol, sellOfferSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const AnswerOfferPrompt: PromptInterface<PromptType.answerOffer> = (props) => {
  const initiatorPlayer = getPlayerById(props.game, props.game.prompt.playerId);
  const square = getSquareById(props.game, props.game.prompt.propertyId);
  const targetPlayer = getPlayerById(props.game, props.game.prompt.targetPlayerId);
  const isBuyingOffer = props.game.prompt.offerType === OfferType.buy;
  const canAnswer = canAnswerOffer(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>{targetPlayer.name}</Title>
      <Paragraph>
        <span>{isBuyingOffer ? buyOfferSymbol : sellOfferSymbol}</span>
        <span style={{ paddingLeft: 8 }}>{`${initiatorPlayer.name} offers ${
          isBuyingOffer ? 'buying' : 'selling'
        } ${square.name} for ${currencySymbol}${props.game.prompt.amount}`}</span>
      </Paragraph>
      <div>
        <Button
          disabled={!canAnswer}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.acceptOffer });
          }}
        >
          Accept
        </Button>
        <Button
          disabled={!canAnswer}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.declineOffer });
          }}
          type="delete"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
