import { GamePhase, LiquidationReason, PromptType, TransitionType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  ExpenseEvent,
  GameLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameUiTransitionPhase,
  PayRentEvent,
  PendingEvent,
} from '../types';

export type CannotPayPromptInputPhases =
  | GamePlayPhase
  | GameUiTransitionPhase<TransitionType.jailDiceRoll> // Is player's last turn in jail and they don't have enough money to pay the fine
  | GamePromptPhase<PromptType.card>
  | GameLiquidationPhase<LiquidationReason.pendingPayment>; // Player resumes a pending payment but they still don't have enough money

export type ExpenseInputPhases =
  | GamePlayPhase
  | GamePromptPhase<PromptType.card>
  | GameLiquidationPhase<LiquidationReason.pendingPayment>; // Player resumes a pending payment and has enough money

export type ExpenseOutputPhases = GamePlayPhase | GamePromptPhase<PromptType.cannotPay>;

export const triggerCannotPayPrompt = (
  game: CannotPayPromptInputPhases,
  event: PendingEvent,
): GamePromptPhase<PromptType.cannotPay> => {
  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: {
      pendingEvent: event,
      type: PromptType.cannotPay,
    },
  };
};

export const triggerExpense = (
  game: ExpenseInputPhases,
  event: ExpenseEvent,
): ExpenseOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);
  const nextGame: ExpenseOutputPhases = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
        centerPot: game.centerPot + event.amount,
        notifications: [...game.notifications, event],
        phase: GamePhase.play,
        players: game.players.map((p) => {
          return p.id === currentPlayer.id ? { ...p, money: p.money - event.amount } : p;
        }),
      }
    : triggerCannotPayPrompt(game, event);

  return nextGame;
};

export const triggerPayRent = (
  game: ExpenseInputPhases,
  event: PayRentEvent,
): ExpenseOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);

  const nextGame: ExpenseOutputPhases = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
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
    : triggerCannotPayPrompt(game, event);

  return nextGame;
};
