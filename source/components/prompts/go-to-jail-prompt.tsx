import React from 'react';
import { EventType, PromptType } from '../../enums';
import { getCurrentPlayer } from '../../logic';
import { triggerGoToJail } from '../../triggers';
import { GenericEvent } from '../../types';
import { EventComponent } from '../common/event';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);
  const event: GenericEvent<EventType.goToJail> = {
    playerId: currentPlayer.id,
    type: EventType.goToJail,
  };

  return (
    <OkPrompt
      okHandler={() => {
        props.updateGame(triggerGoToJail(props.game, event));
      }}
    >
      <EventComponent game={props.game} event={event} />
    </OkPrompt>
  );
};
