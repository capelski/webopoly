import React from 'react';
import { JailSource, NotificationType, PromptType } from '../../enums';
import { getPlayerById } from '../../logic';
import { triggerGoToJail } from '../../triggers';
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
  [PromptType.cannotPay]: () => {
    return (
      <OkPrompt
        okHandler={() => {
          // TODO Allow the player to sell houses, mortgage properties, sell properties, etc.
        }}
      >
        <div>That's the end of it for this player</div>
      </OkPrompt>
    );
  },
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: (props) => {
    return (
      <OkPrompt
        okHandler={() => {
          props.updateGame(triggerGoToJail(props.game, JailSource.square));
        }}
      >
        <NotificationComponent
          game={props.game}
          notification={{
            playerId: props.game.currentPlayerId,
            source: JailSource.square,
            type: NotificationType.goToJail,
          }}
        />
      </OkPrompt>
    );
  },
  [PromptType.jailOptions]: JailOptionsPrompt,
  [PromptType.playerWin]: (props) => {
    const winningPlayer = getPlayerById(props.game, props.prompt.playerId);
    return (
      <PlayerWinPrompt
        clearGameHandler={() => props.updateGame(undefined)}
        winningPlayer={winningPlayer}
      />
    );
  },
};
