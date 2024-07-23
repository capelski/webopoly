import { Game, GameUpdate, Player } from '@webopoly/core';
import React from 'react';

export interface RowComponentDefinitionProps {
  game: Game;
  isLandscape: boolean;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
  zoom: number;
}

export type RowComponentDefinition = React.FC<RowComponentDefinitionProps>;
