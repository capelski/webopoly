import React from 'react';
import { Game, Prompt } from '../../types';
import { Modal } from '../common/modal';
import { PromptInterface } from './prompt-interface';
import { renderersMap } from './renderers-map';

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
      {renderer({
        game: nextGame,
        prompt: props.prompt,
        updateGame: props.updateGame,
      })}
    </Modal>
  );
};
