import React from 'react';
import { PromptType } from '../../enums';
import { Game, Prompt } from '../../types';

export type PromptInterface<T extends PromptType = PromptType> = React.FC<{
  prompt: Prompt & { type: T };
  game: Game;
  updateGame: (game: Game | undefined) => void;
}>;
