import React from 'react';
import { NotificationSource, NotificationType, PromptType } from '../../enums';
import { triggerGoToJail } from '../../triggers';
import { NotificationComponent } from '../common/notification';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
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
};
