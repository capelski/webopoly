import {
  canAnswerOffer,
  currencySymbol,
  Game_AnswerOffer,
  GameUpdateType,
  getPlayerById,
  getSquareById,
  OfferType,
} from '@webopoly/core';
import React from 'react';
import { buyOfferSymbol, sellOfferSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const AnswerOfferPrompt: PromptInterface<Game_AnswerOffer> = (props) => {
  const initiatorPlayer = getPlayerById(props.game, props.game.phaseData.playerId);
  const square = getSquareById(props.game, props.game.phaseData.propertyId);
  const targetPlayer = getPlayerById(props.game, props.game.phaseData.targetPlayerId);
  const isBuyingOffer = props.game.phaseData.offerType === OfferType.buy;
  const canAnswer = canAnswerOffer(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>{targetPlayer.name}</Title>
      <Paragraph>
        <span>{isBuyingOffer ? buyOfferSymbol : sellOfferSymbol}</span>
        <span style={{ paddingLeft: 8 }}>{`${initiatorPlayer.name} offers ${
          isBuyingOffer ? 'buying' : 'selling'
        } ${square.name} for ${currencySymbol}${props.game.phaseData.amount}`}</span>
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
          autoClick={GameUpdateType.declineOffer}
          defaultAction={props.game.defaultAction}
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
