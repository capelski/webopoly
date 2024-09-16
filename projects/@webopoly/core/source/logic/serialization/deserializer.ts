import { GamePhase, PropertyType, SquareType } from '../../enums';
import { Game, GameMinified, GEvent, Player, Square } from '../../types';
import { squaresMap } from '../squares';
import { eventsMap, Restorer } from './events-map';

export const deserializeGame = (serializedGame: string | null): Game | undefined => {
  if (!serializedGame) {
    return undefined;
  }

  const g = JSON.parse(serializedGame) as GameMinified;
  let game: Game | undefined = undefined;

  try {
    game = {
      centerPot: g.cp,
      currentPlayerId: g.ci,
      defaultAction: g.da,
      dice: g.d,
      eventHistory: g.eh.map<GEvent>((e) => {
        const restore = eventsMap[e.t].restore as Restorer;
        return restore(e);
      }),
      nextCardIds: g.nci,
      notifications: g.n.map<GEvent>((e) => {
        const restore = eventsMap[e.t].restore as Restorer;
        return restore(e);
      }),
      players: g.pl.map<Player>((p) => ({
        color: p.c,
        doublesInARow: p.d,
        getOutOfJail: p.g,
        id: p.i,
        isInJail: p.ij,
        money: p.m,
        name: p.n,
        properties: p.p,
        status: p.s,
        squareId: p.si,
        turnsInJail: p.t,
      })),
      squares: g.sq.map<Square>((s) => {
        const square = squaresMap[s.i];

        if (square.type === SquareType.property && s.t === SquareType.property) {
          square.ownerId = s.o;
          square.status = s.s;

          if (square.propertyType === PropertyType.street && s.pt === PropertyType.street) {
            square.houses = s.h;
          }
        }

        return square;
      }),
      ...(g.ph === GamePhase.buyPropertyLiquidation
        ? { phase: g.ph, pendingPrompt: g.pp }
        : g.ph === GamePhase.pendingPaymentLiquidation
        ? { phase: g.ph, pendingEvent: g.pe }
        : g.ph === GamePhase.prompt
        ? { phase: g.ph, prompt: g.pr }
        : g.ph === GamePhase.trade
        ? { phase: g.ph, previousPhase: g.pp, other: g.ot, ownSquaresId: g.ows }
        : g.ph === GamePhase.playerAnimation
        ? {
            phase: g.ph,
            animation: g.a,
          }
        : { phase: g.ph }),
    };
  } catch (error) {
    console.error(error);
  }

  return game;
};
