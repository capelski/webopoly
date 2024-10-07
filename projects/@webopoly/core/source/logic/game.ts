import { playerInitialMoney } from '../constants';
import {
  EventType,
  GamePhase,
  GameUpdateType,
  PlayerStatus,
  PropertyType,
  SquareType,
} from '../enums';
import { Game, Player, Square } from '../types';
import { getCardAmount } from './cards';
import { squares } from './squares';
import { turnConsiderations } from './turn-considerations';

export const clearNotifications = (game: Game<any>): Game<any> => {
  return {
    ...game,
    notifications: [],
    eventHistory: [...game.notifications.reverse(), ...game.eventHistory],
  };
};

export const getActivePlayers = (game: Game<any>): Player[] => {
  return game.players.filter((p) => p.status === PlayerStatus.playing);
};

export const getCurrentPlayer = (
  game: Game<any>,
  { omitTurnConsiderations }: { omitTurnConsiderations?: boolean } = {},
): Player => {
  const playerId =
    (!omitTurnConsiderations &&
      (turnConsiderations.answeringOffer(game)?.currentPlayerId ||
        turnConsiderations.answeringTrade(game)?.currentPlayerId ||
        turnConsiderations.buyingProperty(game)?.currentPlayerId ||
        turnConsiderations.buyingPropertyLiquidation(game)?.currentPlayerId)) ||
    game.currentPlayerId;

  return game.players.find((p) => {
    return p.id === playerId;
  })!;
};

export const getCurrentSquare = (game: Game<any>): Square => {
  const currentPlayer = getCurrentPlayer(game);
  return game.squares.find((s) => s.id === currentPlayer.squareId)!;
};

export const getOtherPlayers = (game: Game<any>, playerId: Player['id']): Player[] => {
  return game.players.filter((p) => p.status === PlayerStatus.playing && p.id !== playerId);
};

export const getNextPlayerId = (game: Game<any>): Player['id'] => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getNextSquareId = (
  game: Game<any>,
  movement: number,
  startingSquareId?: Square['id'],
): Square['id'] => {
  const currentSquareId = startingSquareId || getCurrentSquare(game).id;
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const safeMovement = movement + game.squares.length; // Necessary to support negative movements
  const nextSquareIndex = (currentSquareIndex + safeMovement) % game.squares.length;
  return game.squares[nextSquareIndex].id;
};

export const getNextPropertyOfTypeId = (
  game: Game<any>,
  propertyType: PropertyType,
): Square['id'] => {
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
  game: Game<GamePhase.paymentLiquidation> | Game<GamePhase.cannotPay>,
) => {
  const amount =
    game.phaseData.type === EventType.card
      ? getCardAmount(game, game.phaseData.cardId)
      : game.phaseData.amount;
  return amount;
};

export const getPlayerById = (game: Game<any>, playerId: Player['id']): Player => {
  return game.players.find((p) => p.id === playerId)!;
};

export const getSquareById = (game: Game<any>, squareId: Square['id']): Square => {
  return game.squares.find((s) => s.id === squareId)!;
};

export const startGame = (playerNames: string[]): Game<any> => {
  const players = playerNames.map<Player>((name, index) => ({
    color: 'hsl(' + ((index * (360 / playerNames.length)) % 360) + ', 100%, 50%)',
    doublesInARow: 0,
    getOutOfJail: 0,
    id: `${index + 1}`,
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
    defaultAction: {
      playerId: currentPlayerId,
      update: { type: GameUpdateType.rollDice },
    },
    dice: [],
    eventHistory: [],
    nextCardIds: [],
    notifications: [],
    phase: GamePhase.rollDice,
    players,
    squares,
  };
};
