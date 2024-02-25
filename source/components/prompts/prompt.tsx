import React from 'react';
import { PromptType } from '../../enums';
import { Game, GamePromptPhase } from '../../types';
import { Modal } from '../common/modal';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { BuyPropertyPrompt } from './buy-property-prompt';
import { CannotPayPrompt } from './cannot-pay-prompt';
import { CardPrompt } from './card-prompt';
import { GoToJailPrompt } from './go-to-jail-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { PlayerWinsPrompt } from './player-wins-prompt';
import { PromptInterface } from './prompt-interface';

const promptsMap: {
  [TKey in PromptType]: { inset?: string; renderer: PromptInterface<TKey> };
} = {
  [PromptType.answerOffer]: { renderer: AnswerOfferPrompt },
  [PromptType.buyProperty]: { inset: '5% 20px', renderer: BuyPropertyPrompt },
  [PromptType.cannotPay]: { renderer: CannotPayPrompt },
  [PromptType.card]: { renderer: CardPrompt },
  [PromptType.goToJail]: { renderer: GoToJailPrompt },
  [PromptType.jailOptions]: { renderer: JailOptionsPrompt },
  [PromptType.playerWins]: { renderer: PlayerWinsPrompt },
};

interface PromptComponentProps {
  game: GamePromptPhase<PromptType>;
  updateGame: (game: Game | undefined) => void;
}

export const PromptComponent: React.FC<PromptComponentProps> = (props) => {
  const renderer: PromptInterface<PromptType> = promptsMap[props.game.prompt.type].renderer;
  const { inset } = promptsMap[props.game.prompt.type];
  return <Modal inset={inset}>{renderer(props)}</Modal>;
};
