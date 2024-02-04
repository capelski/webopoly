import { GamePhase, PlayerStatus, PropertyType, SquareType } from '../enums';
import { playerInitialMoney } from '../parameters';
import { Game, GameMinified, Id, Player, PlayerMinified, Square, SquareMinified } from '../types';

export const createGame = (nPlayers: number): GameMinified => {
  const minifiedSquares = [...Array(40)].map<SquareMinified>((_, index) => ({
    i: index + 1,
    t: SquareType.chance, // The incorrect type will be overwrite on the first restore
  }));

  const minifiedPlayers = [...Array(nPlayers)].map<PlayerMinified>((_, index) => ({
    c: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
    g: 0,
    i: index + 1,
    ij: false,
    m: playerInitialMoney,
    n: `Player ${index + 1}`,
    p: [],
    si: minifiedSquares[0].i,
    s: PlayerStatus.playing,
    t: 0,
  }));
  const currentPlayerId = minifiedPlayers[0].i;

  return {
    cp: 0,
    ci: currentPlayerId,
    d: [],
    eh: [],
    nh: [],
    no: [],
    n: [],
    ph: GamePhase.rollDice,
    pl: minifiedPlayers,
    sq: minifiedSquares,
  };
};

export const getActivePlayers = (game: Game): Player[] => {
  return game.players.filter((p) => p.status === PlayerStatus.playing);
};

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.id === game.currentPlayerId)!;
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
