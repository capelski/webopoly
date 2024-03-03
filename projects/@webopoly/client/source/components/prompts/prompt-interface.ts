import React from 'react';
import { Game, GamePromptPhase, PromptType } from '../../../../core';

export type PromptInterface<TPrompt extends PromptType> = React.FC<{
  game: GamePromptPhase<TPrompt>;
  updateGame: (game: Game | undefined) => void;
}>;