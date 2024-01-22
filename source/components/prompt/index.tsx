import React from 'react';
import { NotificationType, OfferType, PromptType } from '../../enums';
import {
  getChanceCardById,
  getCommunityChestCardById,
  getPlayerById,
  getSquareById,
  goToJail,
} from '../../logic';
import { currencySymbol } from '../../parameters';
import { triggerAcceptOffer, triggerDeclineOffer } from '../../triggers';
import { Game, Notification, Prompt } from '../../types';
import { Modal } from '../modal';
import { NotificationComponent } from '../notification';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CardPrompt } from './card-prompt';
import { OkPrompt } from './ok-prompt';
import { PlayerWinPrompt } from './player-win-prompt';

type PromptRenderer<T extends PromptType = PromptType> = (
  prompt: Prompt & { type: T },
  game: Game,
  updateGame: (game: Game | undefined) => void,
) => React.ReactNode;

const renderersMap: {
  [TKey in PromptType]: PromptRenderer<TKey>;
} = {
  [PromptType.answerOffer]: (prompt, game, updateGame) => {
    const player = getSquareById(game, prompt.playerId);
    const square = getSquareById(game, prompt.propertyId);
    const owner = getPlayerById(game, prompt.targetPlayerId);
    const isBuyingOffer = prompt.offerType === OfferType.buy;

    return (
      <AnswerOfferPrompt
        acceptHandler={() => {
          updateGame(triggerAcceptOffer(game, prompt));
        }}
        declineHandler={() => {
          updateGame(triggerDeclineOffer(game, prompt));
        }}
      >
        <div>
          <span>{isBuyingOffer ? '⬅️' : '➡️'}</span>
          <span style={{ paddingLeft: 8 }}>{`${player.name} places ${currencySymbol}${
            prompt.amount
          } ${isBuyingOffer ? 'BUY' : 'SELL'} offer for ${square.name} to ${owner.name}`}</span>
        </div>
      </AnswerOfferPrompt>
    );
  },
  [PromptType.chance]: (prompt, game, updateGame) => {
    return (
      <CardPrompt
        okHandler={() => {
          const card = getChanceCardById(prompt.cardId);
          const nextGame = card.action({
            ...game,
            pastNotifications: [
              {
                cardId: prompt.cardId,
                playerId: prompt.playerId,
                type: NotificationType.chance,
              },
              ...game.pastNotifications,
            ],
          });
          updateGame(nextGame);
        }}
        cardId={prompt.cardId}
        type={prompt.type}
      />
    );
  },
  [PromptType.communityChest]: (prompt, game, updateGame) => {
    return (
      <CardPrompt
        okHandler={() => {
          const card = getCommunityChestCardById(prompt.cardId);
          const nextGame = card.action({
            ...game,
            pastNotifications: [
              {
                cardId: prompt.cardId,
                playerId: prompt.playerId,
                type: NotificationType.communityChest,
              },
              ...game.pastNotifications,
            ],
          });
          updateGame(nextGame);
        }}
        cardId={prompt.cardId}
        type={prompt.type}
      />
    );
  },
  [PromptType.goToJail]: (prompt, game, updateGame) => {
    const notification: Notification = {
      playerId: prompt.playerId,
      type: NotificationType.goToJail,
    };
    return (
      <OkPrompt
        okHandler={() => {
          const nextGame = goToJail({
            ...game,
            pastNotifications: [notification, ...game.pastNotifications],
          });
          updateGame(nextGame);
        }}
      >
        <NotificationComponent game={game} notification={notification} />
      </OkPrompt>
    );
  },
  [PromptType.playerWin]: (prompt, game, updateGame) => {
    const winningPlayer = getPlayerById(game, prompt.playerId);
    return (
      <PlayerWinPrompt
        clearGameHandler={() => updateGame(undefined)}
        winningPlayer={winningPlayer}
      />
    );
  },
};

interface PromptComponentProps {
  game: Game;
  prompt: Prompt;
  updateGame: (game: Game | undefined) => void;
}

export const PromptComponent: React.FC<PromptComponentProps> = (props) => {
  const renderer: PromptRenderer = renderersMap[props.prompt.type];
  /* Unsetting the current prompt here, as the next trigger could set another prompt
   * (e.g. rollDice -> chanceCard) */
  const nextGame: Game = { ...props.game, prompt: undefined };

  return <Modal inset="25% 20px">{renderer(props.prompt, nextGame, props.updateGame)}</Modal>;
};
