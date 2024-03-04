import { jailFine, playerInitialMoney } from '../constants';
import {
  EventType,
  GamePhase,
  LiquidationReason,
  PlayerStatus,
  PromptType,
  PropertyType,
  SquareType,
} from '../enums';
import { Game, GameLiquidationPhase, GamePromptPhase, Id, Player, Square } from '../types';

import { getCardAmount } from './cards';
import { squares } from './squares';

export const createGame = (playerNames: string[]): Game => {
  const players = playerNames.map<Player>((name, index) => ({
    color: 'hsl(' + ((index * (360 / playerNames.length)) % 360) + ', 100%, 50%)',
    getOutOfJail: 0,
    id: index + 1,
    isInJail: false,
    money: playerInitialMoney,
    name,
    properties: [],
    squareId: squares[0].id,
    status: PlayerStatus.playing,
    turnsInJail: 0,
  }));
  const currentPlayerId = players[0].id;

  return {
    centerPot: 0,
    currentPlayerId,
    dice: [],
    eventHistory: [],
    nextCardIds: [],
    notifications: [],
    phase: GamePhase.rollDice,
    players,
    squares,
  };
};

export const getActivePlayers = (game: Game): Player[] => {
  return game.players.filter((p) => p.status === PlayerStatus.playing);
};

export const getCurrentPlayer = (
  game: Game,
  { omitBuyPhase }: { omitBuyPhase?: boolean } = {},
): Player => {
  return game.players.find((p) => {
    return (
      p.id ===
      (game.phase === GamePhase.liquidation && game.reason === LiquidationReason.buyProperty
        ? game.pendingPrompt.currentBuyerId
        : !omitBuyPhase &&
          game.phase === GamePhase.prompt &&
          game.prompt.type === PromptType.buyProperty
        ? game.prompt.currentBuyerId
        : game.phase === GamePhase.prompt && game.prompt.type === PromptType.answerOffer
        ? game.prompt.targetPlayerId
        : game.currentPlayerId)
    );
  })!;
};

export const getCurrentSquare = (game: Game): Square => {
  const currentPlayer = getCurrentPlayer(game);
  return game.squares.find((s) => s.id === currentPlayer.squareId)!;
};

export const getOtherPlayers = (game: Game, playerId: Id): Player[] => {
  return game.players.filter((p) => p.status === PlayerStatus.playing && p.id !== playerId);
};

export const getNextPlayerId = (game: Game): Id => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getNextSquareId = (game: Game, movement: number, startingSquareId?: Id): Id => {
  const currentSquareId = startingSquareId || getCurrentSquare(game).id;
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const safeMovement = movement + game.squares.length; // Necessary to support negative movements
  const nextSquareIndex = (currentSquareIndex + safeMovement) % game.squares.length;
  return game.squares[nextSquareIndex].id;
};

export const getNextPropertyOfTypeId = (game: Game, propertyType: PropertyType): Id => {
  const currentSquare = getCurrentSquare(game);
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquare.id);
  const nextSquareIndex = (currentSquareIndex + 1) % game.squares.length;
  const squaresPool = game.squares
    .slice(nextSquareIndex)
    .concat(game.squares.slice(0, nextSquareIndex));
  return squaresPool.find((s) => s.type === SquareType.property && s.propertyType === propertyType)!
    .id;
};

export const getPendingAmount = (
  game:
    | GameLiquidationPhase<LiquidationReason.pendingPayment>
    | GamePromptPhase<PromptType.cannotPay>,
) => {
  const { pendingEvent } = game.phase === GamePhase.liquidation ? game : game.prompt;
  const amount =
    pendingEvent.type === EventType.turnInJail
      ? jailFine
      : pendingEvent.type === EventType.card
      ? getCardAmount(game, pendingEvent.cardId)
      : pendingEvent.amount;
  return amount;
};

export const getPlayerById = (game: Game, playerId: Id): Player => {
  return game.players.find((p) => p.id === playerId)!;
};

export const getSquareById = (game: Game, squareId: Id): Square => {
  return game.squares.find((s) => s.id === squareId)!;
};
