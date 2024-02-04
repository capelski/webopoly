import { PromptType } from '../enums';
import { MovePlayerOutputPhases } from '../triggers';
import { GamePromptPhase } from './game';
import { Id } from './id';

export type Card = {
  action: (game: GamePromptPhase<PromptType.card>) => MovePlayerOutputPhases;
  id: Id;
  skipEvent?: boolean;
  text: string;
};
