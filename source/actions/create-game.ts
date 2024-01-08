import { GamePhase, PlayerStatus, SquareType } from '../enums';
import { playerInitialMoney } from '../parameters';
import { GameMinified, PlayerMinified, SquareMinified } from '../types';

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
