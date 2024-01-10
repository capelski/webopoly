import { PlayerStatus, PropertyType, SquareType } from '../enums';
import { Game, Id, Player, Square, StreetSquare } from '../types';

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.id === game.currentPlayerId)!;
};

export const getCurrentSquare = (game: Game): Square => {
  const currentPlayer = getCurrentPlayer(game);
  return game.squares.find((s) => s.id === currentPlayer.squareId)!;
};

export const getNextPlayerId = (game: Game) => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getNextSquareId = (game: Game, movement: number) => {
  const currentSquare = getCurrentSquare(game);
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquare.id);
  const nextSquareIndex = (currentSquareIndex + movement) % game.squares.length;
  return game.squares[nextSquareIndex].id;
};

export const getPlayerById = (game: Game, playerId: Id): Player => {
  return game.players.find((p) => p.id === playerId)!;
};

export const getSquareById = (game: Game, squareId: Id): Square => {
  return game.squares.find((s) => s.id === squareId)!;
};

export const payFee = (game: Game, fee: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    centerPot: game.centerPot + fee,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money - fee } : p;
    }),
  };
};

export const payStreetRepairs = (game: Game, housePrice: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const playerStreets = game.squares.filter(
    (s) =>
      s.type === SquareType.property &&
      s.propertyType === PropertyType.street &&
      s.ownerId === currentPlayer.id,
  ) as StreetSquare[];
  const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);
  return payFee(game, houses * housePrice);
};

export const payToAllPlayers = (game: Game, amount: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const activePlayersId = game.players
    .filter((p) => p.status !== PlayerStatus.bankrupt && p.id !== currentPlayer.id)
    .map((p) => p.id);

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
        ? { ...p, money: p.money - activePlayersId.length * amount }
        : activePlayersId.includes(p.id)
        ? { ...p, money: p.money + amount }
        : p;
    }),
  };
};

export const receiveFromAllPlayers = (game: Game, amount: number): Game => {
  return payToAllPlayers(game, -amount);
};

export const receivePayout = (game: Game, payout: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money + payout } : p;
    }),
  };
};
