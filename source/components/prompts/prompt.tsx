import React from 'react';
import { GamePhase } from '../../enums';
import { Game, Prompt } from '../../types';
import { Modal } from '../common/modal';
import { PromptInterface } from './prompt-interface';
import { promptsMap } from './prompts-map';

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
