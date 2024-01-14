import React, { useState } from 'react';
import { ChangeType } from '../enums';
import { getChanceCardById, getCommunityChestCardById } from '../logic';
import { Id } from '../types';
import { Button } from './button';
import { OkModal } from './ok-modal';

interface CardModalProps {
  applyCardHandler: () => void;
  cardId: Id;
  type: ChangeType.chance | ChangeType.communityChest;
}

export const CardModal: React.FC<CardModalProps> = (props) => {
  const [revealed, setRevealed] = useState(false);
  const card =
    props.type === ChangeType.chance
      ? getChanceCardById(props.cardId)
      : getCommunityChestCardById(props.cardId);

  return (
    <React.Fragment>
      {revealed ? (
        <OkModal applyCardHandler={props.applyCardHandler}>
          <p>{card.text}</p>
        </OkModal>
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
