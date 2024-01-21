import {
  collectCenterPot,
  getChanceCardById,
  getCommunityChestCardById,
  getCurrentPlayer,
  getOutOfJail,
  goToJail,
  passGo,
  payRent,
  payTax,
  remainInJail,
} from '.';
import { ChangeType, PlayerStatus, PromptType, UiUpdateType } from '../enums';
import { triggerAcceptOffer, triggerDeclineOffer } from '../triggers';
import {
  Change,
  Game,
  SplitUiUpdates,
  UiUpdate,
  UiUpdateParams,
  UiUpdateTransformer,
} from '../types';

const transformersMap: { [TKey in ChangeType]: UiUpdateTransformer<TKey> } = {
  [ChangeType.answerOffer]: (game) => game, // Not addressed here
  [ChangeType.bankruptcy]: (game) => game, // Not addressed here
  [ChangeType.buildHouse]: (game) => game,
  [ChangeType.buyProperty]: (game) => game,
  [ChangeType.chance]: (game, change) => {
    const card = getChanceCardById(change.cardId);
    return card.action(game);
  },
  [ChangeType.clearMortgage]: (game) => game,
  [ChangeType.communityChest]: (game, change) => {
    const card = getCommunityChestCardById(change.cardId);
    return card.action(game);
  },
  [ChangeType.freeParking]: (game) => collectCenterPot(game),
  [ChangeType.getOutOfJail]: (game) => getOutOfJail(game),
  [ChangeType.goToJail]: (game) => goToJail(game),
  [ChangeType.mortgage]: (game) => game,
  [ChangeType.passGo]: (game) => passGo(game),
  [ChangeType.payRent]: (game, change) => payRent(game, change.landlordId, change.rent),
  [ChangeType.payTax]: (game, change) => payTax(game, change.tax),
  [ChangeType.placeOffer]: (game, change, params) => {
    if (params.offerAnswer === 'accept') {
      return triggerAcceptOffer(game, change);
    } else {
      return triggerDeclineOffer(game, change);
    }
  },
  [ChangeType.playerWin]: (game) => game, // Not addressed here
  [ChangeType.remainInJail]: (game) => remainInJail(game),
  [ChangeType.rollDice]: (game) => game,
  [ChangeType.sellHouse]: (game) => game,
};

export const applyUiUpdates = (game: Game, { params, uiUpdateType }: UiUpdateParams): Game => {
  const { currentUpdates, pendingUpdates } = splitUiUpdates(game.uiUpdates, uiUpdateType);
  const newUiUpdates: UiUpdate[] = [];

  let nextGame = game;

  currentUpdates.forEach((change) => {
    const transformer: UiUpdateTransformer = transformersMap[change.type];
    const { uiUpdates, ...rest } = transformer(nextGame, change, params);
    nextGame = { ...rest, uiUpdates: [] };
    newUiUpdates.push(...uiUpdates.filter((n) => !game.uiUpdates.includes(n)));
  });

  const changeHistory: Change[] = [];
  const currentPlayer = getCurrentPlayer(nextGame);

  if (currentPlayer.money < 0) {
    changeHistory.unshift({
      playerId: currentPlayer.id,
      type: ChangeType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = nextGame.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      newUiUpdates.push({
        playerId: remainingPlayers[0].id,
        promptType: PromptType.playerWin,
        type: ChangeType.playerWin,
        uiUpdateType: UiUpdateType.prompt,
      });
    }
  }

  return {
    ...nextGame,
    changeHistory: [...changeHistory, ...currentUpdates.reverse(), ...nextGame.changeHistory],
    uiUpdates: pendingUpdates.concat(newUiUpdates),
  };
};

const splitUiUpdates = (uiUpdates: UiUpdate[], uiUpdateType: UiUpdateType): SplitUiUpdates => {
  return uiUpdates.reduce<SplitUiUpdates>(
    (reduced, change) => {
      if (change.uiUpdateType === uiUpdateType) {
        reduced.currentUpdates.push(change);
      } else {
        reduced.pendingUpdates.push(change);
      }
      return reduced;
    },
    {
      currentUpdates: [],
      pendingUpdates: [],
    },
  );
};
