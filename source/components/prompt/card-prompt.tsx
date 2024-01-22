import React, { useState } from 'react';
import { PromptType } from '../../enums';
import { getChanceCardById, getCommunityChestCardById } from '../../logic';
import { Id } from '../../types';
import { Button } from '../button';
import { OkPrompt } from './ok-prompt';

interface CardPromptProps {
  cardId: Id;
  okHandler: () => void;
  type: PromptType.chance | PromptType.communityChest;
}

export const CardPrompt: React.FC<CardPromptProps> = (props) => {
  const [revealed, setRevealed] = useState(false);
  const card =
    props.type === PromptType.chance
      ? getChanceCardById(props.cardId)
      : getCommunityChestCardById(props.cardId);

  return (
    <React.Fragment>
      {revealed ? (
        <OkPrompt okHandler={props.okHandler}>
          <p>{card.text}</p>
        </OkPrompt>
      ) : (
        <div>
          <h3>{props.type === PromptType.chance ? 'Chance' : 'Community chest'} card</h3>
          <Button
            onClick={() => {
              setRevealed(true);
            }}
          >
            Reveal
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};
