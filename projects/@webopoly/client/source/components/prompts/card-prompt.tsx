import React, { useState } from 'react';
import {
  canApplyCard,
  GameUpdateType,
  getCardAmount,
  getCardText,
  PromptType,
} from '../../../../core';
import { surpriseSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const CardPrompt: PromptInterface<PromptType.card> = (props) => {
  const [hasDrawn, setHasDrawn] = useState(false);
  const amount = getCardAmount(props.game, props.game.prompt.cardId);
  const canApply = canApplyCard(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>
      {hasDrawn ? (
        <OkPrompt
          disabled={!canApply}
          okHandler={() => {
            props.triggerUpdate({ type: GameUpdateType.applyCard });
          }}
        >
          <Paragraph>{getCardText(props.game.prompt.cardId, amount)}</Paragraph>
        </OkPrompt>
      ) : (
        <div>
          <Title>Surprise card</Title>
          <Button
            disabled={!canApply}
            onClick={() => {
              setHasDrawn(true);
            }}
          >
            Draw
          </Button>
        </div>
      )}
    </div>
  );
};
