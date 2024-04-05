import React from 'react';
import { GamePromptPhase, GameUpdate, Player, PromptType } from '../../../../core';

export type PromptInterface<TPrompt extends PromptType> = React.FC<{
  exitGame: () => void;
  game: GamePromptPhase<TPrompt>;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}>;
