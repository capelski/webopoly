import { GamePhase } from '@webopoly/core';
import React from 'react';
import { Modal } from '../common/modal';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { AnswerTradePrompt } from './answer-trade-prompt';
import { ApplyCardPrompt } from './apply-card-prompt';
import { BuyPropertyPrompt } from './buy-property-prompt';
import { CannotPayPrompt } from './cannot-pay-prompt';
import { DrawCardPrompt } from './draw-card-prompt';
import { JailNotificationPrompt } from './jail-notification-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { PlayerWinsPrompt } from './player-wins-prompt';
import { PromptInterface } from './prompt-interface';

export const PromptComponent: PromptInterface = (props) => {
  const inset =
    props.game.phase === GamePhase.answerTrade
      ? '15% 20px'
      : props.game.phase === GamePhase.buyProperty
      ? '5% 20px'
      : undefined;

  return (
    <Modal inset={inset}>
      {props.game.phase === GamePhase.answerOffer ? (
        <AnswerOfferPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.answerTrade ? (
        <AnswerTradePrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.applyCard ? (
        <ApplyCardPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.buyProperty ? (
        <BuyPropertyPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.cannotPay ? (
        <CannotPayPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.drawCard ? (
        <DrawCardPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.jailNotification ? (
        <JailNotificationPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.jailOptions ? (
        <JailOptionsPrompt {...props} game={props.game} />
      ) : props.game.phase === GamePhase.playerWins ? (
        <PlayerWinsPrompt {...props} game={props.game} />
      ) : undefined}
    </Modal>
  );
};
