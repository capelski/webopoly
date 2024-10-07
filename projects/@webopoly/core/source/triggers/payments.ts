import { longActionInterval } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import { Game, PayRentEvent, PayTaxEvent, PendingEvent } from '../types';

export type CannotPayInputPhases =
  | Game<GamePhase.avatarAnimation>
  | Game<GamePhase.applyCard>
  | Game<GamePhase.paymentLiquidation>; // Player resumes a pending payment but they still don't have enough money

export type ExpenseInputPhases =
  | Game<GamePhase.avatarAnimation>
  | Game<GamePhase.applyCard>
  | Game<GamePhase.paymentLiquidation>; // Player resumes a pending payment and has enough money

export type ExpenseOutputPhases = Game<GamePhase.play> | Game<GamePhase.cannotPay>;

export const triggerCannotPay = (
  game: CannotPayInputPhases,
  event: PendingEvent,
): Game<GamePhase.cannotPay> => {
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
