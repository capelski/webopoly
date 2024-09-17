import { longActionInterval } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  GameApplyCardPhase,
  GameCannotPayPhase,
  GameDiceInJailAnimationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayPhase,
  PayRentEvent,
  PayTaxEvent,
  PendingEvent,
} from '../types';

export type CannotPayInputPhases =
  | GamePlayPhase
  | GameDiceInJailAnimationPhase // Is player's last turn in jail and they don't have enough money to pay the fine
  | GameApplyCardPhase
  | GamePendingPaymentLiquidationPhase; // Player resumes a pending payment but they still don't have enough money

export type ExpenseInputPhases =
  | GamePlayPhase
  | GameApplyCardPhase
  | GamePendingPaymentLiquidationPhase; // Player resumes a pending payment and has enough money

export type ExpenseOutputPhases = GamePlayPhase | GameCannotPayPhase;

export const triggerCannotPay = (
  game: CannotPayInputPhases,
  event: PendingEvent,
): GameCannotPayPhase => {
  return {
    ...game,
    defaultAction: {
      interval: longActionInterval * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.bankruptcy },
    },
    phase: GamePhase.cannotPay,
    phaseData: event,
  };
};

export const triggerPayRent = (
  game: ExpenseInputPhases,
  event: PayRentEvent,
): ExpenseOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);

  const nextGame: ExpenseOutputPhases = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
        defaultAction: {
          playerId: currentPlayer.id,
          update: { type: GameUpdateType.endTurn },
        },
        notifications: [...game.notifications, event],
        phase: GamePhase.play,
        players: game.players.map((p) => {
          return p.id === currentPlayer.id
            ? { ...p, money: p.money - event.amount }
            : p.id === event.landlordId
            ? { ...p, money: p.money + event.amount }
            : p;
        }),
      }
    : triggerCannotPay(game, event);

  return nextGame;
};

export const triggerPayTax = (
  game: ExpenseInputPhases,
  event: PayTaxEvent,
): ExpenseOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);
  const nextGame: ExpenseOutputPhases = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
        defaultAction: {
          playerId: currentPlayer.id,
          update: { type: GameUpdateType.endTurn },
        },
        centerPot: game.centerPot + event.amount,
        notifications: [...game.notifications, event],
        phase: GamePhase.play,
        players: game.players.map((p) => {
          return p.id === currentPlayer.id ? { ...p, money: p.money - event.amount } : p;
        }),
      }
    : triggerCannotPay(game, event);

  return nextGame;
};
