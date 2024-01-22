import React, { useState } from 'react';
import { NotificationType, PromptType } from '../../enums';
import { getChanceCardById, getCommunityChestCardById } from '../../logic';
import { Game, Id } from '../../types';
import { Button } from '../button';
import { OkPrompt } from './ok-prompt';

interface CardPromptProps {
  cardId: Id;
  game: Game;
  type: PromptType.chance | PromptType.communityChest;
  updateGame: (game: Game | undefined) => void;
}

export const CardPrompt: React.FC<CardPromptProps> = (props) => {
  const [revealed, setRevealed] = useState(false);
  const card =
    props.type === PromptType.chance
      ? getChanceCardById(props.cardId)
      : getCommunityChestCardById(props.cardId);

  const okHandler = () => {
    const nextGame: Game = card.action({
      ...props.game,
      pastNotifications: [
        {
          cardId: props.cardId,
          playerId: props.game.currentPlayerId,
          type:
            props.type === PromptType.chance
              ? NotificationType.chance
              : NotificationType.communityChest,
        },
        ...props.game.pastNotifications,
      ],
    });
    props.updateGame(nextGame);
  };

  return (
    <React.Fragment>
      {revealed ? (
        <OkPrompt okHandler={okHandler}>
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
