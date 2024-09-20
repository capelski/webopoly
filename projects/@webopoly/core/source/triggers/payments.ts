import { longActionInterval } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  Game_ApplyCard,
  Game_CannotPay,
  Game_DiceInJailAnimation,
  Game_PaymentLiquidation,
  Game_Play,
  PayRentEvent,
  PayTaxEvent,
  PendingEvent,
} from '../types';

export type CannotPayInputPhases =
  | Game_Play
  | Game_DiceInJailAnimation // Is player's last turn in jail and they don't have enough money to pay the fine
  | Game_ApplyCard
  | Game_PaymentLiquidation; // Player resumes a pending payment but they still don't have enough money

export type ExpenseInputPhases = Game_Play | Game_ApplyCard | Game_PaymentLiquidation; // Player resumes a pending payment and has enough money

export type ExpenseOutputPhases = Game_Play | Game_CannotPay;

export const triggerCannotPay = (
  game: CannotPayInputPhases,
  event: PendingEvent,
): Game_CannotPay => {
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
