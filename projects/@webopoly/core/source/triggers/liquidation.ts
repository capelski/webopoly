import { longActionInterval } from '../constants';
import { CardType, EventType, GamePhase, GameUpdateType, PromptType } from '../enums';
import { getCurrentPlayer, getPendingAmount, hasEnoughMoney } from '../logic';
import {
  GameBuyPropertyLiquidationPhase,
  GameOutOfJailAnimationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePromptPhase,
} from '../types';
import { triggerApplyCard } from './cards';
import { triggerLastTurnInJail } from './jail';
import {
  ExpenseOutputPhases,
  triggerCannotPayPrompt,
  triggerPayRent,
  triggerPayTax,
} from './payments';

export const resumeBuyProperty = (
  game: GameBuyPropertyLiquidationPhase,
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
  game: GamePendingPaymentLiquidationPhase,
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
): GameBuyPropertyLiquidationPhase => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    pendingPrompt: game.prompt,
    phase: GamePhase.buyPropertyLiquidation,
  };
};

export const triggerPendingPaymentLiquidation = (
  game: GamePromptPhase<PromptType.cannotPay>,
): GamePendingPaymentLiquidationPhase => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    pendingEvent: game.prompt.pendingEvent,
    phase: GamePhase.pendingPaymentLiquidation,
  };
};
