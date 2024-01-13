import { GamePhase, PlayerStatus, PropertyType, SquareType } from '../enums';
import { playerInitialMoney } from '../parameters';
import {
  Game,
  GameMinified,
  Id,
  Player,
  PlayerMinified,
  Square,
  SquareMinified,
  StreetSquare,
} from '../types';

export const createGame = (nPlayers: number): GameMinified => {
  const minifiedSquares = [...Array(40)].map<SquareMinified>((_, index) => ({
    i: index + 1,
    t: SquareType.chance, // The incorrect type will be overwrite on the first restore
  }));

  const minifiedPlayers = [...Array(nPlayers)].map<PlayerMinified>((_, index) => ({
    c: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
    i: index + 1,
    m: playerInitialMoney,
    n: `Player ${index + 1}`,
    p: [],
    si: minifiedSquares[0].i,
    s: PlayerStatus.playing,
    t: 0,
  }));

  return {
    cp: 0,
    ci: minifiedPlayers[0].i,
    d: [],
    e: [],
    g: GamePhase.rollDice,
    n: [],
    p: minifiedPlayers,
    s: minifiedSquares,
  };
};

export const endTurn = (game: Game): Game => {
  return {
    ...game,
    currentPlayerId: getNextPlayerId(game),
    gamePhase: GamePhase.rollDice,
  };
};

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.id === game.currentPlayerId)!;
};

export const getCurrentSquare = (game: Game): Square => {
  const currentPlayer = getCurrentPlayer(game);
  return game.squares.find((s) => s.id === currentPlayer.squareId)!;
};

export const getNextPlayerId = (game: Game): Id => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getNextSquareId = (game: Game, movement: number): Id => {
  const currentSquare = getCurrentSquare(game);
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquare.id);
  const nextSquareIndex = (currentSquareIndex + movement) % game.squares.length;
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
