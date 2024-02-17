import React from 'react';
import { EventSource, EventType, PromptType } from '../../enums';
import { getCurrentPlayer } from '../../logic';
import { triggerGoToJail } from '../../triggers';
import { EventComponent } from '../common/event';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <OkPrompt
      okHandler={() => {
        props.updateGame(triggerGoToJail(props.game, EventSource.jailSquare));
      }}
    >
      <EventComponent
        game={props.game}
        event={{
          playerId: currentPlayer.id,
          source: EventSource.jailSquare,
          type: EventType.goToJail,
        }}
      />
    </OkPrompt>
  );
};
