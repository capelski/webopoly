import {
  GamePhase,
  LiquidationReason,
  PropertyType,
  SquareType,
  TransitionType,
} from '../../enums';
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
      dice: g.d,
      eventHistory: g.eh.map<GEvent>((e) => {
        const restore: Restorer = eventsMap[e.t].restore;
        return restore(e);
      }),
      nextCardIds: g.nci,
      notifications: g.n.map<GEvent>((e) => {
        const restore: Restorer = eventsMap[e.t].restore;
        return restore(e);
      }),
      players: g.pl.map<Player>((p) => ({
        color: p.c,
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
      ...(g.ph === GamePhase.liquidation
        ? g.r === LiquidationReason.buyProperty
          ? { phase: g.ph, reason: g.r, pendingPrompt: g.pp }
          : { phase: g.ph, reason: g.r, pendingEvent: g.pe }
        : g.ph === GamePhase.prompt
        ? { phase: g.ph, prompt: g.pr }
        : g.ph === GamePhase.trade
        ? { phase: g.ph, previousPhase: g.pp, other: g.ot, ownSquaresId: g.ows }
        : g.ph === GamePhase.uiTransition
        ? g.tt === TransitionType.player
          ? {
              phase: g.ph,
              transitionType: g.tt,
              transitionData: g.td,
            }
          : { phase: g.ph, transitionType: g.tt }
        : { phase: g.ph }),
    };
  } catch (error) {
    console.error(error);
  }

  return game;
};
