import React, { useState } from 'react';
import { getCardAmount, getCardText, PromptType, triggerCardAction } from '../../../../core';
import { surpriseSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const CardPrompt: PromptInterface<PromptType.card> = (props) => {
  const [hasDrawn, setHasDrawn] = useState(false);
  const amount = getCardAmount(props.game, props.game.prompt.cardId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>
      {hasDrawn ? (
        <OkPrompt
          okHandler={() => {
            props.updateGame(triggerCardAction(props.game, props.game.prompt.cardId));
          }}
        >
          <Paragraph>{getCardText(props.game.prompt.cardId, amount)}</Paragraph>
        </OkPrompt>
      ) : (
        <div>
          <Title>Surprise card</Title>
          <Button
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
