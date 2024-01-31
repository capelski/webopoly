import { NotificationType, PlayerStatus, PropertyType, SquareType } from '../enums';
import { getPlayerById, getSellHouseAmount } from '../logic';
import { Game, Id, Notification, Player, Square } from '../types';
import { triggerEndTurn } from './end-turn';

export const triggerBankruptcy = (game: Game, playerId: Id): Game => {
  const pendingNotification = game.pendingNotification!;
  const bankruptcyNotification: Notification = {
    creditorId:
      pendingNotification.type === NotificationType.payRent
        ? pendingNotification.landlordId
        : undefined,
    playerId,
    type: NotificationType.bankruptcy,
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

  let nextGame: Game =
    pendingNotification.type === NotificationType.payRent
      ? {
          ...game,
          players: game.players.map<Player>((p) => {
            return p.id === playerId
              ? bankruptPlayer
              : p.id === pendingNotification.landlordId
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
              ? { ...s, houses: 0, ownerId: pendingNotification.landlordId }
              : s;
          }),
        }
      : {
          ...game,
          players: game.players.map<Player>((p) => {
            return p.id === playerId ? bankruptPlayer : p;
          }),
          squares: game.squares.map<Square>((s) => {
            return s.type === SquareType.property && s.ownerId === playerId
              ? { ...s, houses: 0, ownerId: undefined, status: undefined }
              : s;
          }),
        };

  nextGame.notifications = [...nextGame.notifications, bankruptcyNotification];
  nextGame.pendingNotification = undefined;

  nextGame = triggerEndTurn(nextGame);

  return nextGame;
};
