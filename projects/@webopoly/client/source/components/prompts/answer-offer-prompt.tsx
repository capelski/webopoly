import React from 'react';
import {
  currencySymbol,
  getPlayerById,
  getSquareById,
  OfferType,
  PromptType,
  triggerAcceptOffer,
  triggerDeclineOffer,
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
          type="delete"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
