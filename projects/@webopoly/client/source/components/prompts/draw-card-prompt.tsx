import { canDrawCard, GameDrawCardPhase, GameUpdateType } from '@webopoly/core';
import React from 'react';
import { surpriseSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const DrawCardPrompt: PromptInterface<GameDrawCardPhase> = (props) => {
  const canDraw = canDrawCard(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>{surpriseSymbol}</div>

      <Title>Surprise card</Title>

      <Button
        autoClick={GameUpdateType.drawCard}
        defaultAction={props.game.defaultAction}
        disabled={!canDraw}
        onClick={() => {
          props.triggerUpdate({ type: GameUpdateType.drawCard });
        }}
      >
        Draw
      </Button>
    </div>
  );
};
