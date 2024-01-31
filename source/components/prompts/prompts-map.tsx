import React from 'react';
import { GamePhase, NotificationSource, NotificationType, PromptType } from '../../enums';
import { getPlayerById } from '../../logic';
import { triggerBankruptcy, triggerGoToJail } from '../../triggers';
import { Button } from '../common/button';
import { NotificationComponent } from '../common/notification';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CardPrompt } from './card-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { OkPrompt } from './ok-prompt';
import { PlayerWinPrompt } from './player-win-prompt';
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
  [PromptType.goToJail]: (props) => {
    return (
      <OkPrompt
        okHandler={() => {
          props.updateGame(triggerGoToJail(props.game, NotificationSource.jailSquare));
        }}
      >
        <NotificationComponent
          game={props.game}
          notification={{
            playerId: props.game.currentPlayerId,
            source: NotificationSource.jailSquare,
            type: NotificationType.goToJail,
          }}
        />
      </OkPrompt>
    );
  },
  [PromptType.jailOptions]: JailOptionsPrompt,
  [PromptType.playerWins]: (props) => {
    const winningPlayer = getPlayerById(props.game, props.prompt.playerId);
    return (
      <PlayerWinPrompt
        clearGameHandler={() => props.updateGame(undefined)}
        winningPlayer={winningPlayer}
      />
    );
  },
};
