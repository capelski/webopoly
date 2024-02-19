import { EventType, GamePhase, LiquidationReason, PromptType, TransitionType } from '../enums';
import { getCurrentPlayer, getPendingAmount, hasEnoughMoney } from '../logic';
import { GameLiquidationPhase, GamePromptPhase, GameUiTransitionPhase } from '../types';
import { triggerLastTurnInJail } from './jail';
import {
  ExpenseOutputPhases,
  triggerCannotPayPrompt,
  triggerExpense,
  triggerPayRent,
} from './payments';

export const resumeBuyProperty = (
  game: GameLiquidationPhase<LiquidationReason.buyProperty>,
): GamePromptPhase<PromptType.buyProperty> => {
  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: game.pendingPrompt,
  };
};

export const resumePendingPayment = (
  game: GameLiquidationPhase<LiquidationReason.pendingPayment>,
):
  | GamePromptPhase<PromptType.cannotPay>
  | ExpenseOutputPhases
  | GameUiTransitionPhase<TransitionType.getOutOfJail> => {
  const pendingEvent = game.pendingEvent;
  const amount = getPendingAmount(game);
  const player = getCurrentPlayer(game);

  if (hasEnoughMoney(player, amount)) {
    if (pendingEvent.type === EventType.expense) {
      return triggerExpense(game, pendingEvent);
    } else if (pendingEvent.type === EventType.turnInJail) {
      return triggerLastTurnInJail(game);
    } else {
      return triggerPayRent(game, pendingEvent);
    }
  } else {
    return triggerCannotPayPrompt(game, pendingEvent);
  }
};

export const triggerBuyPropertyLiquidation = (
  game: GamePromptPhase<PromptType.buyProperty>,
): GameLiquidationPhase<LiquidationReason.buyProperty> => {
  return {
    ...game,
    pendingPrompt: game.prompt,
    phase: GamePhase.liquidation,
    reason: LiquidationReason.buyProperty,
  };
};

export const triggerPendingPaymentLiquidation = (
  game: GamePromptPhase<PromptType.cannotPay>,
): GameLiquidationPhase<LiquidationReason.pendingPayment> => {
  return {
    ...game,
    pendingEvent: game.prompt.pendingEvent,
    phase: GamePhase.liquidation,
    reason: LiquidationReason.pendingPayment,
  };
};
