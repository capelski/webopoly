import React from 'react';
import { NotificationType, PromptType } from '../../enums';
import { getPlayerById, goToJail } from '../../logic';
import { Game, Notification, Prompt } from '../../types';
import { Modal } from '../modal';
import { NotificationComponent } from '../notification';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CardPrompt } from './card-prompt';
import { OkPrompt } from './ok-prompt';
import { PlayerWinPrompt } from './player-win-prompt';
import { PromptInterface } from './prompt-interface';

const renderersMap: {
  [TKey in PromptType]: PromptInterface<TKey>;
} = {
  [PromptType.answerOffer]: AnswerOfferPrompt,
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: (props) => {
    const notification: Notification = {
      playerId: props.game.currentPlayerId,
      type: NotificationType.goToJail,
    };
    return (
      <OkPrompt
        okHandler={() => {
          const nextGame = goToJail({
            ...props.game,
            pastNotifications: [notification, ...props.game.pastNotifications],
          });
          props.updateGame(nextGame);
        }}
      >
        <NotificationComponent game={props.game} notification={notification} />
      </OkPrompt>
    );
  },
  [PromptType.playerWin]: (props) => {
    const winningPlayer = getPlayerById(props.game, props.prompt.playerId);
    return (
      <PlayerWinPrompt
        clearGameHandler={() => props.updateGame(undefined)}
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
  const renderer: PromptInterface = renderersMap[props.prompt.type];
  /* Unsetting the current prompt here, as the next trigger could set another prompt
   * (e.g. rollDice -> chanceCard) */
  const nextGame: Game = { ...props.game, prompt: undefined };

  return (
    <Modal inset="25% 20px">
      {renderer({ game: nextGame, prompt: props.prompt, updateGame: props.updateGame })}
    </Modal>
  );
};
