import React from 'react';
import { Game, GamePromptPhase, Player, PromptType } from '../../../../core';

export type PromptInterface<TPrompt extends PromptType> = React.FC<{
  exitGame: () => void;
  game: GamePromptPhase<TPrompt>;
  updateGame: (game: Game) => void;
  windowPlayerId: Player['id'];
}>;
