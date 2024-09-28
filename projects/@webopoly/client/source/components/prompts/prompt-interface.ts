import { Game, GameUpdate, Player } from '@webopoly/core';
import React from 'react';

export type PromptInterface<TGame = Game<any>> = React.FC<{
  exitGame: () => void;
  game: TGame;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}>;
