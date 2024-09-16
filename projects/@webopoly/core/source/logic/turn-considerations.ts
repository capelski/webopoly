import { GamePhase, PromptType } from '../enums';
import { Game } from '../types';
import { castPromptGame } from './game';

export const turnConsiderations = {
  answeringOffer: (game: Game) => {
    return game.phase === GamePhase.prompt && game.prompt.type === PromptType.answerOffer
      ? { currentPlayerId: game.prompt.targetPlayerId, game: castPromptGame(game, game.prompt) }
      : undefined;
  },
  answeringTrade: (game: Game) => {
    return game.phase === GamePhase.prompt && game.prompt.type === PromptType.answerTrade
      ? { currentPlayerId: game.prompt.targetPlayerId, game: castPromptGame(game, game.prompt) }
      : undefined;
  },
  buyingProperty: (game: Game) => {
    return game.phase === GamePhase.prompt && game.prompt.type === PromptType.buyProperty
      ? { currentPlayerId: game.prompt.currentBuyerId, game: castPromptGame(game, game.prompt) }
      : undefined;
  },
  buyingPropertyLiquidation: (game: Game) => {
    return game.phase === GamePhase.buyPropertyLiquidation
      ? { currentPlayerId: game.pendingPrompt.currentBuyerId, game }
      : undefined;
  },
};
