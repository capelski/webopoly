import React, { useState } from 'react';
import { PromptType } from '../../enums';
import { getSurpriseCardById } from '../../logic';
import { surpriseSymbol } from '../../parameters';
import { triggerCardAction } from '../../triggers';
import { Button } from '../common/button';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const CardPrompt: PromptInterface<PromptType.card> = (props) => {
  const [hasDrawn, setHasDrawn] = useState(false);

  const card = getSurpriseCardById(props.game.prompt.cardId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>
      {hasDrawn ? (
        <OkPrompt
          okHandler={() => {
            props.updateGame(triggerCardAction(props.game, props.game.prompt));
          }}
        >
          <p>{card.text}</p>
        </OkPrompt>
      ) : (
        <div>
          <h3>Surprise card</h3>
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
