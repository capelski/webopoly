import { longActionInterval } from '../constants';
import {
  CardType,
  EventType,
  GamePhase,
  GameUpdateType,
  LiquidationReason,
  PromptType,
} from '../enums';
import { getCurrentPlayer, getPendingAmount, hasEnoughMoney } from '../logic';
import { GameLiquidationPhase, GameOutOfJailAnimationPhase, GamePromptPhase } from '../types';
import { triggerApplyCard } from './cards';
import { triggerLastTurnInJail } from './jail';
import {
  ExpenseOutputPhases,
  triggerCannotPayPrompt,
  triggerPayRent,
  triggerPayTax,
} from './payments';

export const resumeBuyProperty = (
  game: GameLiquidationPhase<LiquidationReason.buyProperty>,
): GamePromptPhase<PromptType.buyProperty> => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.buyPropertyReject },
    },
    phase: GamePhase.prompt,
    prompt: game.pendingPrompt,
  };
};

export const resumePendingPayment = (
  game: GameLiquidationPhase<LiquidationReason.pendingPayment>,
): GamePromptPhase<PromptType.cannotPay> | ExpenseOutputPhases | GameOutOfJailAnimationPhase => {
  const pendingEvent = game.pendingEvent;
  const amount = getPendingAmount(game);
  const player = getCurrentPlayer(game);

  if (hasEnoughMoney(player, amount)) {
    if (pendingEvent.type === EventType.card) {
      return triggerApplyCard<CardType.fee | CardType.streetRepairs>(game, pendingEvent.cardId);
    } else if (pendingEvent.type === EventType.payTax) {
      return triggerPayTax(game, pendingEvent);
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
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
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
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    pendingEvent: game.prompt.pendingEvent,
    phase: GamePhase.liquidation,
    reason: LiquidationReason.pendingPayment,
  };
};
