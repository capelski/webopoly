import { GamePromptPhase, GameUpdate, Player, PromptType } from '@webopoly/core';
import React from 'react';

export type PromptInterface<TPrompt extends PromptType> = React.FC<{
  exitGame: () => void;
  game: GamePromptPhase<TPrompt>;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}>;
