import React, { useState } from 'react';
import { CardType, PromptType } from '../../enums';
import { getChanceCardById, getCommunityChestCardById } from '../../logic';
import { triggerCardAction } from '../../triggers';
import { Button } from '../common/button';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const CardPrompt: PromptInterface<PromptType.card> = (props) => {
  const [hasDrawn, setHasDrawn] = useState(false);
  const isChanceCard = props.game.prompt.cardType === CardType.chance;
  const card = isChanceCard
    ? getChanceCardById(props.game.prompt.cardId)
    : getCommunityChestCardById(props.game.prompt.cardId);

  return (
    <React.Fragment>
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
          <h3>{isChanceCard ? 'Chance' : 'Community chest'} card</h3>
          <Button
            onClick={() => {
              setHasDrawn(true);
            }}
          >
            Draw
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};
