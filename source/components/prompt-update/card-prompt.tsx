import React, { useState } from 'react';
import { ChangeType } from '../../enums';
import { getChanceCardById, getCommunityChestCardById } from '../../logic';
import { Id } from '../../types';
import { Button } from '../button';
import { OkPrompt } from './ok-prompt';

interface CardPromptComponentProps {
  cardId: Id;
  okHandler: () => void;
  type: ChangeType.chance | ChangeType.communityChest;
}

export const CardPromptComponent: React.FC<CardPromptComponentProps> = (props) => {
  const [revealed, setRevealed] = useState(false);
  const card =
    props.type === ChangeType.chance
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
          <h3>{props.type === ChangeType.chance ? 'Chance' : 'Community chest'} card</h3>
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
