import React from 'react';
import { GameUpdateType, getCurrentPlayer, mustGoToJail, PromptType } from '../../../../core';
import { goToJailSymbol } from '../../parameters';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <OkPrompt
      disabled={!mustGoToJail(props.game, props.windowPlayerId)}
      okHandler={() => {
        props.triggerUpdate({ type: GameUpdateType.goToJail });
      }}
    >
      <Title>{currentPlayer.name}</Title>
      <Paragraph>{goToJailSymbol} Go to Jail</Paragraph>
    </OkPrompt>
  );
};
