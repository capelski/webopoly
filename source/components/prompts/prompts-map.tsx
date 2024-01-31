import React from 'react';
import { GamePhase, PromptType } from '../../enums';
import { triggerBankruptcy } from '../../triggers';
import { Button } from '../common/button';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CardPrompt } from './card-prompt';
import { GoToJailPrompt } from './go-to-jail-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { PlayerWinsPrompt } from './player-wins-prompt';
import { PromptInterface } from './prompt-interface';

export const promptsMap: {
  [TKey in PromptType]: PromptInterface<TKey>;
} = {
  [PromptType.answerOffer]: AnswerOfferPrompt,
  [PromptType.cannotPay]: (props) => {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Not enough money</h3>
        <div style={{ marginBottom: 16 }}></div>
        <div>
          <Button
            onClick={() => {
              props.updateGame({ ...props.game, status: GamePhase.cannotPay });
            }}
          >
            Sell/Mortgage properties
          </Button>
          <Button
            onClick={() => {
              props.updateGame(triggerBankruptcy(props.game, props.game.currentPlayerId));
            }}
          >
            Declare bankruptcy
          </Button>
        </div>
      </div>
    );
  },
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: GoToJailPrompt,
  [PromptType.jailOptions]: JailOptionsPrompt,
  [PromptType.playerWins]: PlayerWinsPrompt,
};
