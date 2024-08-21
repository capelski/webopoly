import { GameUpdateType, getCurrentPlayer, mustGoToJail, PromptType } from '@webopoly/core';
import React from 'react';
import { goToJailSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const GoToJailPrompt: PromptInterface<PromptType.goToJail> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>{currentPlayer.name}</Title>
      <Paragraph>{goToJailSymbol} Go to Jail</Paragraph>

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
