import {
  GamePhase,
  LiquidationReason,
  PromptType,
  PropertyType,
  SquareType,
  TransitionType,
} from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  ExpenseCardEvent,
  ExpenseEvent,
  GameLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameUiTransitionPhase,
  PayRentEvent,
  PendingEvent,
  StreetSquare,
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

// This function requires a new type of event (e.g. ExpenseBroadcastEvent);
// not wildly complicated but a lot of effort for little gain
// export const triggerPayToAllPlayers = (game: Game, amount: number): Game => {
//   const currentPlayer = getCurrentPlayer(game);
//   const otherPlayersId = getOtherPlayers(game, game.currentPlayerId).map((p) => p.id);

//   return {
//     ...game,
//     players: game.players.map((p) => {
//       return p.id === currentPlayer.id
//         ? // PENDING Assess player money
//           { ...p, money: p.money - otherPlayersId.length * amount }
//         : otherPlayersId.includes(p.id)
//         ? { ...p, money: p.money + amount }
//         : p;
//     }),
//   };
// };

// This function can cause a player to go bankrupt outside of its turn; significant changes
// are required to switch the currentPlayerId in the middle of a player turn
// export const triggerReceiveFromAllPlayers = (game: Game, amount: number): Game => {
//   const currentPlayer = getCurrentPlayer(game);
//   const otherPlayersId = getOtherPlayers(game, game.currentPlayerId).map((p) => p.id);

//   return {
//     ...game,
//     players: game.players.map((p) => {
//       return p.id === currentPlayer.id
//         ? { ...p, money: p.money + otherPlayersId.length * amount }
//         : otherPlayersId.includes(p.id)
//         ? // PENDING Assess each other player money
//           { ...p, money: p.money - amount }
//         : p;
//     }),
//   };
// };

export const triggerRepairsExpense = (
  game: GamePromptPhase<PromptType.card>,
  housePrice: number,
  partialEvent: Omit<ExpenseCardEvent, 'amount'>,
): ExpenseOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);
  const playerStreets = game.squares.filter(
    (s) =>
      s.type === SquareType.property &&
      s.propertyType === PropertyType.street &&
      s.ownerId === currentPlayer.id,
  ) as StreetSquare[];
  const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);

  return triggerExpense(game, {
    ...partialEvent,
    amount: houses * housePrice,
  });
};

export const triggerWindfall = (
  game: GamePromptPhase<PromptType.card>,
  payout: number,
): GamePlayPhase => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money + payout } : p;
    }),
  };
};
