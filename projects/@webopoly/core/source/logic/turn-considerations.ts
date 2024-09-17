import { GamePhase } from '../enums';
import { Game } from '../types';

export const turnConsiderations = {
  answeringOffer: (game: Game) => {
    return game.phase === GamePhase.answerOffer
      ? { currentPlayerId: game.prompt.targetPlayerId, game }
      : undefined;
  },
  answeringTrade: (game: Game) => {
    return game.phase === GamePhase.answerTrade
      ? { currentPlayerId: game.prompt.targetPlayerId, game }
      : undefined;
  },
  buyingProperty: (game: Game) => {
    return game.phase === GamePhase.buyProperty
      ? { currentPlayerId: game.prompt.currentBuyerId, game }
      : undefined;
  },
  buyingPropertyLiquidation: (game: Game) => {
    return game.phase === GamePhase.buyPropertyLiquidation
      ? { currentPlayerId: game.pendingPrompt.currentBuyerId, game }
      : undefined;
  },
};
