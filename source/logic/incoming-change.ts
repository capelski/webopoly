import {
  buildHouse,
  buyProperty,
  clearMortgage,
  collectCenterPot,
  endTurn,
  getChanceCardById,
  getCommunityChestCardById,
  getCurrentPlayer,
  getNextSquareId,
  getOutOfJail,
  goToJail,
  mortgage,
  passGo,
  payRent,
  payTax,
  remainInJail,
  sellHouse,
} from '.';
import { ChangeType, ChangeUiType, GamePhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { triggerMovePlayer } from '../triggers';
import { Change, Game, IncomingChange, SplitChanges } from '../types';

type Transformer<T = ChangeType> = (game: Game, change: Change & { type: T }) => Game;

const transformersMap: { [TKey in ChangeType]: Transformer<TKey> } = {
  [ChangeType.bankruptcy]: (game) => game, // Not addressed here
  [ChangeType.buildHouse]: (game, change) => buildHouse(game, change.propertyId),
  [ChangeType.buyProperty]: (game, change) => buyProperty(game, change.propertyId),
  [ChangeType.chance]: (game, change) => {
    const card = getChanceCardById(change.cardId);
    return card.action(game);
  },
  [ChangeType.clearMortgage]: (game, change) => clearMortgage(game, change.propertyId),
  [ChangeType.communityChest]: (game, change) => {
    const card = getCommunityChestCardById(change.cardId);
    return card.action(game);
  },
  [ChangeType.endTurn]: (game) => endTurn(game),
  [ChangeType.freeParking]: (game) => collectCenterPot(game),
  [ChangeType.getOutOfJail]: (game) => getOutOfJail(game),
  [ChangeType.goToJail]: (game) => goToJail(game),
  [ChangeType.mortgage]: (game, change) => mortgage(game, change.propertyId),
  [ChangeType.passGo]: (game) => passGo(game),
  [ChangeType.payRent]: (game, change) => payRent(game, change.landlordId, change.rent),
  [ChangeType.payTax]: (game, change) => payTax(game, change.tax),
  [ChangeType.playerWin]: (game) => game, // Not addressed here
  [ChangeType.remainInJail]: (game) => remainInJail(game),
  [ChangeType.rollDice]: (game) => {
    const movement = game.dice.reduce((x, y) => x + y, 0);
    const nextSquareId = getNextSquareId(game, movement);
    return triggerMovePlayer(game, nextSquareId);
  },
  [ChangeType.sellHouse]: (game, change) => sellHouse(game, change.propertyId),
};

export const applyIncomingChanges = (game: Game, uiType: ChangeUiType): Game => {
  const { currentChanges, pendingChanges } = splitIncomingChanges(game.incomingChanges, uiType);
  const newIncomingChanges: IncomingChange[] = [];

  let nextGame = game;

  currentChanges.forEach((change) => {
    const transformer: Transformer = transformersMap[change.type];
    const { incomingChanges, ...rest } = transformer(nextGame, change);
    nextGame = { ...rest, incomingChanges: [] };
    newIncomingChanges.push(...incomingChanges.filter((n) => !game.incomingChanges.includes(n)));
  });

  const changeHistory: Change[] = [];
  let nextGamePhase = nextGame.gamePhase;
  const currentPlayer = getCurrentPlayer(nextGame);

  if (currentPlayer.money < 0) {
    changeHistory.unshift({
      playerId: currentPlayer.id,
      type: ChangeType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = nextGame.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      nextGamePhase = GamePhase.finished;
      changeHistory.unshift({
        playerId: currentPlayer.id,
        type: ChangeType.playerWin,
      });
    }
  }

  return {
    ...nextGame,
    changeHistory: [
      ...changeHistory,
      ...currentChanges.filter((n) => n.uiType !== ChangeUiType.silent).reverse(),
      ...nextGame.changeHistory,
    ],
    gamePhase: nextGamePhase,
    incomingChanges: pendingChanges.concat(newIncomingChanges),
  };
};

const splitIncomingChanges = (
  incomingChanges: IncomingChange[],
  uiType: ChangeUiType,
): SplitChanges => {
  return incomingChanges.reduce<SplitChanges>(
    (reduced, change) => {
      if (change.uiType === uiType) {
        reduced.currentChanges.push(change);
      } else {
        reduced.pendingChanges.push(change);
      }
      return reduced;
    },
    {
      currentChanges: [],
      pendingChanges: [],
    },
  );
};
