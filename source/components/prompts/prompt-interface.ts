import React from 'react';
import { PromptType } from '../../enums';
import { Game, GamePromptPhase } from '../../types';

export type PromptInterface<TPrompt extends PromptType> = React.FC<{
  game: GamePromptPhase<TPrompt>;
  updateGame: (game: Game | undefined) => void;
}>;
