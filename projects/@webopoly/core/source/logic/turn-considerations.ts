import { GamePhase } from '../enums';
import { Game } from '../types';

export const turnConsiderations = {
  answeringOffer: (game: Game<any>) => {
    return game.phase === GamePhase.answerOffer
      ? { currentPlayerId: game.phaseData.targetPlayerId, game }
      : undefined;
  },
  answeringTrade: (game: Game<any>) => {
    return game.phase === GamePhase.answerTrade
      ? { currentPlayerId: game.phaseData.targetPlayerId, game }
      : undefined;
  },
  buyingProperty: (game: Game<any>) => {
    return game.phase === GamePhase.buyProperty
      ? { currentPlayerId: game.phaseData.currentBuyerId, game }
      : undefined;
  },
  buyingPropertyLiquidation: (game: Game<any>) => {
    return game.phase === GamePhase.buyingLiquidation
      ? { currentPlayerId: game.phaseData.currentBuyerId, game }
      : undefined;
  },
};
