import React from 'react';
import { GamePhase, PromptType } from '../../enums';
import { Game, Prompt } from '../../types';
import { Modal } from '../common/modal';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CannotPayPrompt } from './cannot-pay-prompt';
import { CardPrompt } from './card-prompt';
import { GoToJailPrompt } from './go-to-jail-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { PlayerWinsPrompt } from './player-wins-prompt';
import { PromptInterface } from './prompt-interface';

const promptsMap: {
  [TKey in PromptType]: PromptInterface<TKey>;
} = {
  [PromptType.answerOffer]: AnswerOfferPrompt,
  [PromptType.cannotPay]: CannotPayPrompt,
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: GoToJailPrompt,
  [PromptType.jailOptions]: JailOptionsPrompt,
  [PromptType.playerWins]: PlayerWinsPrompt,
};

interface PromptComponentProps {
  game: Game;
  prompt: Prompt;
  updateGame: (game: Game | undefined) => void;
}

export const PromptComponent: React.FC<PromptComponentProps> = (props) => {
  const renderer: PromptInterface = promptsMap[props.prompt.type];
  const nextGame: Game = { ...props.game, status: GamePhase.play };

  return (
    <Modal inset="25% 20px">
      {renderer({
        game: nextGame,
        prompt: props.prompt,
        updateGame: props.updateGame,
      })}
    </Modal>
  );
};
