import React from 'react';
import { NotificationType, PromptType } from '../../enums';
import { getPlayerById } from '../../logic';
import { triggerGoToJail } from '../../triggers';
import { Notification } from '../../types';
import { NotificationComponent } from '../common/notification';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CardPrompt } from './card-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { OkPrompt } from './ok-prompt';
import { PlayerWinPrompt } from './player-win-prompt';
import { PromptInterface } from './prompt-interface';

export const renderersMap: {
  [TKey in PromptType]: PromptInterface<TKey>;
} = {
  [PromptType.answerOffer]: AnswerOfferPrompt,
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: (props) => {
    const notification: Notification = {
      playerId: props.game.currentPlayerId,
      type: NotificationType.goToJail,
    };

    return (
      <OkPrompt
        okHandler={() => {
          props.updateGame(
            triggerGoToJail({
              ...props.game,
              pastNotifications: [notification, ...props.game.pastNotifications],
            }),
          );
        }}
      >
        <NotificationComponent game={props.game} notification={notification} />
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
