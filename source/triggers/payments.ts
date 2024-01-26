import { PlayerStatus, PropertyType, SquareType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Id, StreetSquare } from '../types';

export const triggerPayFee = (game: Game, fee: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    centerPot: game.centerPot + fee,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money - fee } : p;
    }),
  };
};

export const triggerPayRent = (game: Game, landlordId: Id, rent: number): Game => {
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? { ...p, money: p.money - rent }
        : p.id === landlordId
        ? { ...p, money: p.money + rent }
        : p;
    }),
  };
};

export const triggerPayStreetRepairs = (game: Game, housePrice: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const playerStreets = game.squares.filter(
    (s) =>
      s.type === SquareType.property &&
      s.propertyType === PropertyType.street &&
      s.ownerId === currentPlayer.id,
  ) as StreetSquare[];
  const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);
  return triggerPayFee(game, houses * housePrice);
};

export const triggerPayTax = (game: Game, tax: number): Game => {
  return {
    ...game,
    centerPot: game.centerPot + tax,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money - tax } : p;
    }),
  };
};

export const triggerPayToAllPlayers = (game: Game, amount: number): Game => {
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

export const triggerReceiveFromAllPlayers = (game: Game, amount: number): Game => {
  return triggerPayToAllPlayers(game, -amount);
};

export const triggerReceivePayout = (game: Game, payout: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money + payout } : p;
    }),
  };
};
