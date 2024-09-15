import {
  EventType,
  exceedsMaxDoublesInARow,
  GameUpdateType,
  getCurrentPlayer,
  mustGoToJail,
  PromptType,
} from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { EventComponent } from '../common/event';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <div style={{ textAlign: 'center' }}>
      <EventComponent
        game={props.game}
        event={{
          type: EventType.goToJail,
          playerId: currentPlayer.id,
          tooManyDoublesInARow: exceedsMaxDoublesInARow(currentPlayer.doublesInARow),
        }}
      />

      <Button
        autoClick={GameUpdateType.goToJail}
        defaultAction={props.game.defaultAction}
        disabled={!mustGoToJail(props.game, props.windowPlayerId)}
        onClick={() => {
          props.triggerUpdate({ type: GameUpdateType.goToJail });
        }}
      >
        Ok
      </Button>
    </div>
  );
};
