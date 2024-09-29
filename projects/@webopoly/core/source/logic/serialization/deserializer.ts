import { GamePhase, PropertyType, SquareType } from '../../enums';
import { Game, GEvent, MinifiedGame, Player, Square } from '../../types';
import { squaresMap } from '../squares';
import { eventsMap, Restorer } from './events-map';

export const deserializeGame = (serializedGame: string | null): Game<any> | undefined => {
  if (!serializedGame) {
    return undefined;
  }

  const g = JSON.parse(serializedGame) as MinifiedGame<any>;
  let game: Game<any> | undefined = undefined;

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
      ...(g.ph === GamePhase.answerOffer
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.answerTrade
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.applyCard
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.avatarAnimation
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.buyProperty
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.buyingLiquidation
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.cannotPay
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.paymentLiquidation
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.playerWins
        ? { phase: g.ph, phaseData: g.pd }
        : g.ph === GamePhase.trade
        ? { phase: g.ph, phaseData: g.pd }
        : { phase: g.ph }),
    };
  } catch (error) {
    console.error(error);
  }

  return game;
};
