import React from 'react';
import {
  EventType,
  GenericEvent,
  getCurrentPlayer,
  PromptType,
  triggerGoToJail,
} from '../../../../core';
import { goToJailSymbol } from '../../parameters';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
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
      <Title>{currentPlayer.name}</Title>
      <Paragraph>{goToJailSymbol} Go to Jail</Paragraph>
    </OkPrompt>
  );
};
