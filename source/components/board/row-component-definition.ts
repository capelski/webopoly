import React from 'react';
import { Game } from '../../types';

export interface RowComponentDefinitionProps {
  game: Game;
  isDesktop: boolean;
  updateGame: (game: Game) => void;
}

export type RowComponentDefinition = React.FC<RowComponentDefinitionProps>;
