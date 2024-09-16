import { GamePhase, PromptType } from '../enums';
import { Player } from './player';
import { Prompt } from './prompt';
import { Square } from './square';

export type PhasePayloadBase<T extends GamePhase> = {
  phase: T;
};

export type PromptPhasePayload<TPrompt extends PromptType = PromptType> =
  PhasePayloadBase<GamePhase.prompt> & {
    prompt: Prompt<TPrompt>;
  };

export type TradePhasePayload = PhasePayloadBase<GamePhase.trade> & {
  previousPhase: GamePhase.play | GamePhase.rollDice;
  other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
  ownSquaresId: Square['id'][];
};
