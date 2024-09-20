import { longActionInterval } from '../constants';
import { CardType, EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, getPendingAmount, hasEnoughMoney } from '../logic';
import {
  Game_BuyProperty,
  Game_BuyingLiquidation,
  Game_CannotPay,
  Game_OutOfJailAnimation,
  Game_PaymentLiquidation,
} from '../types';
import { triggerApplyCard } from './cards';
import { triggerLastTurnInJail } from './jail';
import { ExpenseOutputPhases, triggerCannotPay, triggerPayRent, triggerPayTax } from './payments';

export const resumeBuyProperty = (game: Game_BuyingLiquidation): Game_BuyProperty => {
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
  game: Game_PaymentLiquidation,
): Game_CannotPay | ExpenseOutputPhases | Game_OutOfJailAnimation => {
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

export const triggerBuyPropertyLiquidation = (game: Game_BuyProperty): Game_BuyingLiquidation => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    phase: GamePhase.buyingLiquidation,
  };
};

export const triggerPendingPaymentLiquidation = (game: Game_CannotPay): Game_PaymentLiquidation => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.resume },
    },
    phase: GamePhase.paymentLiquidation,
  };
};
