import React from 'react';
import { Game, GameUpdate, Player } from '../../../../core';

export interface RowComponentDefinitionProps {
  game: Game;
  isLandscape: boolean;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
  zoom: number;
}

export type RowComponentDefinition = React.FC<RowComponentDefinitionProps>;
