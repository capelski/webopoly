import {
  canApplyCard,
  GameUpdateType,
  getCardAmount,
  getCardText,
  PromptType,
} from '@webopoly/core';
import React from 'react';
import { surpriseSymbol } from '../../parameters';
import { Paragraph } from '../common/paragraph';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const ApplyCardPrompt: PromptInterface<PromptType.applyCard> = (props) => {
  const amount = getCardAmount(props.game, props.game.prompt.cardId);
  const canApply = canApplyCard(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>
      <OkPrompt
        disabled={!canApply}
        okHandler={() => {
          props.triggerUpdate({ type: GameUpdateType.applyCard });
        }}
      >
        <Paragraph>{getCardText(props.game.prompt.cardId, amount)}</Paragraph>
      </OkPrompt>
    </div>
  );
};
