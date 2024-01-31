import React from 'react';
import { EventSource, EventType, PromptType } from '../../enums';
import { triggerGoToJail } from '../../triggers';
import { EventComponent } from '../common/event';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  return (
    <OkPrompt
      okHandler={() => {
        props.updateGame(triggerGoToJail(props.game, EventSource.jailSquare));
      }}
    >
      <EventComponent
        game={props.game}
        event={{
          playerId: props.game.currentPlayerId,
          source: EventSource.jailSquare,
          type: EventType.goToJail,
        }}
      />
    </OkPrompt>
  );
};
