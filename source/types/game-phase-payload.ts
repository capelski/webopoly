import { GamePhase, PromptType, TransitionType } from '../enums';
import { PendingEvent } from './event';
import { Id } from './id';
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

export type UiTransitionPhasePayload<TTransition extends TransitionType = TransitionType> =
  PhasePayloadBase<GamePhase.uiTransition> & {
    transitionType: TTransition;
  } & (
      | {
          transitionType: TransitionType.dice;
        }
      | {
          transitionData: {
            currentSquareId: Id;
            pendingMoves: number;
            playerId: Id;
          };
          transitionType: TransitionType.player;
        }
    );

export type NonPromptPhasePayload =
  | CannotPayPhasePayload
  | PlayPhasePayload
  | RollDicePhasePayload
  | UiTransitionPhasePayload;
