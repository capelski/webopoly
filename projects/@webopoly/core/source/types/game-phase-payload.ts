import { GamePhase, PromptType } from '../enums';
import { Prompt } from './prompt';

export type PhasePayloadBase<T extends GamePhase> = {
  phase: T;
};

export type PromptPhasePayload<TPrompt extends PromptType = PromptType> =
  PhasePayloadBase<GamePhase.prompt> & {
    prompt: Prompt<TPrompt>;
  };
