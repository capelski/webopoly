import {
  canApplyCard,
  GameUpdateType,
  getCardAmount,
  getCardText,
  PromptType,
} from '@webopoly/core';
import React from 'react';
import { surpriseSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { PromptInterface } from './prompt-interface';

export const ApplyCardPrompt: PromptInterface<PromptType.applyCard> = (props) => {
  const amount = getCardAmount(props.game, props.game.prompt.cardId);
  const canApply = canApplyCard(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>

      <Paragraph>{getCardText(props.game.prompt.cardId, amount)}</Paragraph>

      <Button
        autoClick={GameUpdateType.applyCard}
        defaultAction={props.game.defaultAction}
        disabled={!canApply}
        onClick={() => {
          props.triggerUpdate({ type: GameUpdateType.applyCard });
        }}
      >
        Ok
      </Button>
    </div>
  );
};
