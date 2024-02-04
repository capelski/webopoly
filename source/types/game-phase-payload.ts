import { GamePhase, PromptType } from '../enums';
import { PendingEvent } from './event';
import { Prompt } from './prompt';

export type PhasePayloadBase<T extends GamePhase> = {
  phase: T;
};

export type CannotPayPhasePayload = PhasePayloadBase<GamePhase.cannotPay> & {
  pendingEvent: PendingEvent;
};

export type PlayPhasePayload = PhasePayloadBase<GamePhase.play>;

export type PromptPhasePayload<TPrompt extends PromptType = PromptType> =
  PhasePayloadBase<GamePhase.prompt> & {
    prompt: Prompt<TPrompt>;
  };

export type RollDicePhasePayload = PhasePayloadBase<GamePhase.rollDice>;

export type NonPromptPhasePayload = CannotPayPhasePayload | PlayPhasePayload | RollDicePhasePayload;
