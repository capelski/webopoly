import { GamePhaseName } from '../enums';
import { Prompt } from './prompt';

export type GamePhase =
  | {
      name: GamePhaseName.cannotPay;
    }
  | {
      name: GamePhaseName.play | GamePhaseName.rollDice;
    }
  | {
      name: GamePhaseName.prompt;
      prompt: Prompt;
    };
