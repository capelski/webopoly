import React from 'react';
import { Game } from '../../../../core';

export interface RowComponentDefinitionProps {
  game: Game;
  isLandscape: boolean;
  updateGame: (game: Game) => void;
  zoom: number;
}

export type RowComponentDefinition = React.FC<RowComponentDefinitionProps>;
