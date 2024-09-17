import { GamePhase } from '../enums';
import { Game } from '../types';

export const turnConsiderations = {
  answeringOffer: (game: Game) => {
    return game.phase === GamePhase.answerOffer
      ? { currentPlayerId: game.phaseData.targetPlayerId, game }
      : undefined;
  },
  answeringTrade: (game: Game) => {
    return game.phase === GamePhase.answerTrade
      ? { currentPlayerId: game.phaseData.targetPlayerId, game }
      : undefined;
  },
  buyingProperty: (game: Game) => {
    return game.phase === GamePhase.buyProperty
      ? { currentPlayerId: game.phaseData.currentBuyerId, game }
      : undefined;
  },
  buyingPropertyLiquidation: (game: Game) => {
    return game.phase === GamePhase.buyPropertyLiquidation
      ? { currentPlayerId: game.phaseData.currentBuyerId, game }
      : undefined;
  },
};
