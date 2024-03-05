import { GamePhase, LiquidationReason, PromptType, TransitionType } from '../enums';
import { PendingEvent } from './event';
import { Player } from './player';
import { BuyPropertyPrompt, Prompt } from './prompt';
import { Square } from './square';

export type PhasePayloadBase<T extends GamePhase> = {
  phase: T;
};

export type LiquidationPhasePayload<TReason extends LiquidationReason = LiquidationReason> =
  PhasePayloadBase<GamePhase.liquidation> &
    (
      | {
          pendingPrompt: BuyPropertyPrompt;
          reason: LiquidationReason.buyProperty;
        }
      | {
          pendingEvent: PendingEvent;
          reason: LiquidationReason.pendingPayment;
        }
    ) & { reason: TReason };

export type PlayPhasePayload = PhasePayloadBase<GamePhase.play>;

export type PromptPhasePayload<TPrompt extends PromptType = PromptType> =
  PhasePayloadBase<GamePhase.prompt> & {
    prompt: Prompt<TPrompt>;
  };

export type RollDicePhasePayload = PhasePayloadBase<GamePhase.rollDice>;

export type TradePhasePayload = PhasePayloadBase<GamePhase.trade> & {
  previousPhase: GamePhase.play | GamePhase.rollDice;
  other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
  ownSquaresId: Square['id'][];
};

export type UiTransitionPhasePayload<TTransition extends TransitionType = TransitionType> =
  PhasePayloadBase<GamePhase.uiTransition> &
    (
      | {
          transitionType: TransitionType.dice;
        }
      | {
          transitionType: TransitionType.getOutOfJail;
        }
      | {
          transitionType: TransitionType.jailDiceRoll;
        }
      | {
          transitionData: {
            currentSquareId: Square['id'];
            pendingMoves: number;
            playerId: Player['id'];
          };
          transitionType: TransitionType.player;
        }
    ) & {
      transitionType: TTransition;
    };

export type NonPromptPhasePayload =
  | LiquidationPhasePayload
  | PlayPhasePayload
  | RollDicePhasePayload
  | UiTransitionPhasePayload;
