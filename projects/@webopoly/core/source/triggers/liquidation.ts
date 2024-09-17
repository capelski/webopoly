import { longActionInterval } from '../constants';
import { CardType, EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, getPendingAmount, hasEnoughMoney } from '../logic';
import {
  GameBuyPropertyLiquidationPhase,
  GameBuyPropertyPhase,
  GameCannotPayPhase,
  GameOutOfJailAnimationPhase,
  GamePendingPaymentLiquidationPhase,
} from '../types';
import { triggerApplyCard } from './cards';
import { triggerLastTurnInJail } from './jail';
import { ExpenseOutputPhases, triggerCannotPay, triggerPayRent, triggerPayTax } from './payments';

export const resumeBuyProperty = (game: GameBuyPropertyLiquidationPhase): GameBuyPropertyPhase => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.buyPropertyReject },
    },
    phase: GamePhase.buyProperty,
  };
};

export const resumePendingPayment = (
  game: GamePendingPaymentLiquidationPhase,
): GameCannotPayPhase | ExpenseOutputPhases | GameOutOfJailAnimationPhase => {
  const amount = getPendingAmount(game);
  const player = getCurrentPlayer(game);

  if (hasEnoughMoney(player, amount)) {
    if (game.phaseData.type === EventType.card) {
      return triggerApplyCard<CardType.fee | CardType.streetRepairs>(game, game.phaseData.cardId);
    } else if (game.phaseData.type === EventType.payTax) {
      return triggerPayTax(game, game.phaseData);
    } else if (game.phaseData.type === EventType.turnInJail) {
      return triggerLastTurnInJail(game);
    } else {
      return triggerPayRent(game, game.phaseData);
    }
  } else {
    return triggerCannotPay(game, game.phaseData);
  }
};

export const triggerBuyPropertyLiquidation = (
  game: GameBuyPropertyPhase,
): GameBuyPropertyLiquidationPhase => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    phase: GamePhase.buyPropertyLiquidation,
  };
};

export const triggerPendingPaymentLiquidation = (
  game: GameCannotPayPhase,
): GamePendingPaymentLiquidationPhase => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    phase: GamePhase.pendingPaymentLiquidation,
  };
};
