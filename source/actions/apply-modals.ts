import { GameEventType, GamePhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getChanceCardById, getCommunityChestCardById, getCurrentPlayer } from '../logic';
import { Game, GameEvent } from '../types';

export const applyModals = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];
  let nextGame: Game = game;

  game.modals.forEach((modal) => {
    switch (modal.type) {
      case GameEventType.chance:
        const chanceCard = getChanceCardById(modal.cardId);
        nextGame = chanceCard.action(game);
        break;
      case GameEventType.communityChest:
        const communityChestCard = getCommunityChestCardById(modal.cardId);
        nextGame = communityChestCard.action(game);
        break;
    }
  });

  let nextTurnPhase: GamePhase = GamePhase.play;
  if (currentPlayer.money < 0) {
    // TODO Allow selling/mortgaging properties

    events.unshift({
      playerId: currentPlayer.id,
      type: GameEventType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = nextGame.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      nextTurnPhase = GamePhase.finished;
      events.unshift({
        playerId: currentPlayer.id,
        type: GameEventType.playerWin,
      });
    }
  }

  return {
    ...nextGame,
    gamePhase: nextTurnPhase,
    modals: [],
    events: [...events, ...nextGame.modals.reverse(), ...nextGame.events],
  };
};
