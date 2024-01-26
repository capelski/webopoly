import React, { useState } from 'react';
import { NotificationType, PromptType } from '../../enums';
import { getChanceCardById, getCommunityChestCardById } from '../../logic';
import { Game } from '../../types';
import { Button } from '../common/button';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

export const CardPrompt: PromptInterface<PromptType.card> = (props) => {
  const [revealed, setRevealed] = useState(false);
  const isChanceCard = props.prompt.cardType === 'chance';
  const card = isChanceCard
    ? getChanceCardById(props.prompt.cardId)
    : getCommunityChestCardById(props.prompt.cardId);

  const okHandler = () => {
    const nextGame: Game = card.action({
      ...props.game,
      pastNotifications: [
        {
          cardId: props.prompt.cardId,
          playerId: props.game.currentPlayerId,
          type: isChanceCard ? NotificationType.chance : NotificationType.communityChest,
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
          <h3>{isChanceCard ? 'Chance' : 'Community chest'} card</h3>
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
