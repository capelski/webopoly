import { EventType, PlayerStatus, PropertyType, SquareType } from '../enums';
import { getPlayerById, getSellHouseAmount } from '../logic';
import { GameCannotPayPhase, GEvent, Player, Square } from '../types';
import { EndTurnOutputPhases, triggerEndTurn } from './end-turn';

export const triggerBankruptcy = (
  game: GameCannotPayPhase,
  playerId: Player['id'],
): EndTurnOutputPhases => {
  const { pendingEvent } = game.prompt;
  const bankruptcyEvent: GEvent = {
    creditorId: pendingEvent.type === EventType.payRent ? pendingEvent.landlordId : undefined,
    playerId,
    type: EventType.bankruptcy,
  };
  const targetPlayer = getPlayerById(game, playerId);
  const bankruptPlayer: Player = {
    ...targetPlayer,
    getOutOfJail: 0,
    isInJail: false,
    money: 0,
    properties: [],
    status: PlayerStatus.bankrupt,
  };
  const housesMoney = game.squares.reduce((reduced, square) => {
    return (
      reduced +
      (square.type === SquareType.property &&
      square.propertyType === PropertyType.street &&
      square.houses > 0
        ? square.houses * getSellHouseAmount(square)
        : 0)
    );
  }, 0);

  const updatedGame: GameCannotPayPhase = {
    ...game,
    players: game.players.map<Player>((p) => {
      return p.id === playerId
        ? bankruptPlayer
        : pendingEvent.type === EventType.payRent && p.id === pendingEvent.landlordId
        ? {
            ...p,
            getOutOfJail: p.getOutOfJail + targetPlayer.getOutOfJail,
            money: p.money + targetPlayer.money + housesMoney,
            properties: [...p.properties, ...targetPlayer.properties],
          }
        : p;
    }),
    squares: game.squares.map<Square>((s) => {
      return s.type === SquareType.property && s.ownerId === playerId
        ? pendingEvent.type === EventType.payRent
          ? { ...s, houses: 0, ownerId: pendingEvent.landlordId }
          : { ...s, houses: 0, ownerId: undefined, status: undefined }
        : s;
    }),
  };

  updatedGame.notifications = [...updatedGame.notifications, bankruptcyEvent];
  const nextGame = triggerEndTurn(updatedGame);

  return nextGame;
};
