import { diceTransitionDuration, maxTurnsInJail, playerTransitionDuration } from '../constants';
import {
  EventType,
  GamePhase,
  GameUpdateType,
  LiquidationReason,
  PlayerStatus,
  PromptType,
  PropertyType,
  SquareType,
  TransitionType,
} from '../enums';
import { getCurrentPlayer, isDoublesRoll, turnConsiderations } from '../logic';
import { Game, GameUpdate, Player } from '../types';
import {
  canAnswerOffer,
  canAnswerTrade,
  canApplyCard,
  canBuildHouse,
  canBuyProperty,
  canCancelTrade,
  canClearMortgage,
  canDeclareBankruptcy,
  canEndTurn,
  canLiquidateBuyProperty,
  canLiquidatePendingPayment,
  canMortgage,
  canPayJailFine,
  canRejectProperty,
  canResume,
  canRollDice,
  canRollDiceInJail,
  canSellHouse,
  canStartTrade,
  canToggleTradeSelection,
  canTriggerBuyingOffer,
  canTriggerSellingOffer,
  canTriggerTradeOffer,
  canUseJailCard,
  mustGoToJail,
} from '../validators';
import { triggerBankruptcy } from './bankruptcy';
import { triggerBuyProperty, triggerRejectProperty } from './buy-property';
import { triggerCardAction } from './cards';
import { triggerDiceRoll, triggerDiceRollInJail } from './dice-roll';
import { triggerEndTurn } from './end-turn';
import { triggerBuildHouse, triggerSellHouse } from './houses';
import {
  triggerGoToJail,
  triggerLastTurnInJail,
  triggerPayJailFine,
  triggerRemainInJail,
  triggerRollDoublesInJail,
  triggerUseJailCard,
} from './jail';
import {
  resumeBuyProperty,
  resumePendingPayment,
  triggerBuyPropertyLiquidation,
  triggerPendingPaymentLiquidation,
} from './liquidation';
import { triggerClearMortgage, triggerMortgage } from './mortgage';
import {
  triggerAcceptOffer,
  triggerBuyingOffer,
  triggerDeclineOffer,
  triggerSellingOffer,
} from './offers';
import {
  triggerAcceptTrade,
  triggerCancelTrade,
  triggerDeclineTrade,
  triggerStartTrade,
  triggerTradeOffer,
  triggerTradeSelectionToggle,
} from './trade';
import { triggerFirstPlayerTransition, triggerNextPlayerTransition } from './transitions';

export const triggerRemovePlayer = (game: Game, playerId: Player['id']): Game => {
  let nextGame: Game = {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId,
        type: EventType.playerExit,
      },
    ],
    players: game.players.map((p) => {
      return p.id === playerId ? { ...p, status: PlayerStatus.bankrupt } : p;
    }),
    squares: game.squares.map((s) => {
      return s.type !== SquareType.property || s.ownerId !== playerId
        ? s
        : s.propertyType !== PropertyType.street
        ? { ...s, ownerId: undefined, status: undefined }
        : { ...s, houses: 0, ownerId: undefined, status: undefined };
    }),
  };

  /** If the player had a pending action to resolve, finish it on their behalf */
  const answeringOffer = turnConsiderations.answeringOffer(nextGame);
  const answeringTrade = turnConsiderations.answeringTrade(nextGame);
  const buyingProperty = turnConsiderations.buyingProperty(nextGame);
  const buyingPropertyLiquidation = turnConsiderations.buyingPropertyLiquidation(nextGame);

  nextGame =
    answeringOffer && answeringOffer.currentPlayerId === playerId
      ? triggerDeclineOffer(answeringOffer.game)
      : answeringTrade && answeringTrade.currentPlayerId === playerId
      ? triggerDeclineTrade(answeringTrade.game)
      : buyingProperty && buyingProperty.currentPlayerId === playerId
      ? triggerRejectProperty(buyingProperty.game)
      : buyingPropertyLiquidation && buyingPropertyLiquidation.currentPlayerId === playerId
      ? triggerRejectProperty(resumeBuyProperty(buyingPropertyLiquidation.game))
      : nextGame;

  /* If it was the player turn, end the turn on their behalf */
  if (getCurrentPlayer(nextGame, { omitTurnConsiderations: true }).id === playerId) {
    nextGame = triggerEndTurn({ ...nextGame, phase: GamePhase.play });
  }

  return nextGame;
};

export const triggerUpdate = (
  game: Game,
  gameUpdate: GameUpdate,
  windowPlayerId: Player['id'],
  updateFunction: (game: Game) => void,
) => {
  if (gameUpdate.type === GameUpdateType.acceptOffer) {
    const validation = canAnswerOffer(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerAcceptOffer(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.acceptTrade) {
    const validation = canAnswerTrade(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerAcceptTrade(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.applyCard) {
    const validation = canApplyCard(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerCardAction(validation.game, validation.game.prompt.cardId));
    }
  } else if (gameUpdate.type === GameUpdateType.bankruptcy) {
    const validation = canDeclareBankruptcy(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerBankruptcy(validation.game, windowPlayerId));
    }
  } else if (gameUpdate.type === GameUpdateType.buildHouse) {
    const validation = canBuildHouse(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      updateFunction(triggerBuildHouse(validation.game, validation.street));
    }
  } else if (gameUpdate.type === GameUpdateType.buyingOffer) {
    const validation = canTriggerBuyingOffer(
      game,
      gameUpdate.squareId,
      gameUpdate.amount,
      windowPlayerId,
    );
    if (validation) {
      updateFunction(triggerBuyingOffer(validation.game, validation.property, gameUpdate.amount));
    }
  } else if (gameUpdate.type === GameUpdateType.buyProperty) {
    const validation = canBuyProperty(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerBuyProperty(validation.game, validation.square, windowPlayerId));
    }
  } else if (gameUpdate.type === GameUpdateType.buyPropertyReject) {
    const validation = canRejectProperty(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerRejectProperty(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.buyPropertyLiquidation) {
    const validation = canLiquidateBuyProperty(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerBuyPropertyLiquidation(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.cancelTrade) {
    const validation = canCancelTrade(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerCancelTrade(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.clearMortgage) {
    const validation = canClearMortgage(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      updateFunction(triggerClearMortgage(validation.game, validation.property));
    }
  } else if (gameUpdate.type === GameUpdateType.declineOffer) {
    const validation = canAnswerOffer(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerDeclineOffer(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.declineTrade) {
    const validation = canAnswerTrade(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerDeclineTrade(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.endTurn) {
    const validation = canEndTurn(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerEndTurn(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.goToJail) {
    const validation = mustGoToJail(game, windowPlayerId);
    if (validation) {
      updateFunction(
        triggerGoToJail(validation.game, validation.game.prompt.type === PromptType.card),
      );
    }
  } else if (gameUpdate.type === GameUpdateType.pendingPaymentLiquidation) {
    const validation = canLiquidatePendingPayment(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerPendingPaymentLiquidation(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.mortgage) {
    const validation = canMortgage(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      updateFunction(triggerMortgage(validation.game, validation.property));
    }
  } else if (gameUpdate.type === GameUpdateType.payJailFine) {
    const validation = canPayJailFine(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerPayJailFine(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.playerTransition) {
    if (game.phase === GamePhase.uiTransition && game.transitionType === TransitionType.player) {
      const nextGame = triggerNextPlayerTransition(game);
      updateFunction(nextGame);

      if (
        nextGame.phase === GamePhase.uiTransition &&
        nextGame.transitionType === TransitionType.player
      ) {
        /** Wait for the UI to animate the transition */
        setTimeout(() => {
          triggerUpdate(
            nextGame,
            { type: GameUpdateType.playerTransition },
            windowPlayerId,
            updateFunction,
          );
        }, playerTransitionDuration * 1000);
      }
    }
  } else if (gameUpdate.type === GameUpdateType.postDice) {
    if (game.phase === GamePhase.uiTransition && game.transitionType === TransitionType.dice) {
      const nextGame = triggerFirstPlayerTransition(game);
      updateFunction(nextGame);

      /** Wait for the UI to animate the transition */
      setTimeout(() => {
        triggerUpdate(
          nextGame,
          { type: GameUpdateType.playerTransition },
          windowPlayerId,
          updateFunction,
        );
      }, playerTransitionDuration * 1000);
    }
  } else if (gameUpdate.type === GameUpdateType.postDiceInJail) {
    if (
      game.phase === GamePhase.uiTransition &&
      game.transitionType === TransitionType.jailDiceRoll
    ) {
      const currentPlayer = getCurrentPlayer(game);
      const isDoubles = isDoublesRoll(game.dice);
      const isLastTurnInJail = currentPlayer.turnsInJail === maxTurnsInJail - 1;

      const nextGame = isDoubles
        ? triggerRollDoublesInJail(game)
        : isLastTurnInJail
        ? triggerLastTurnInJail(game)
        : triggerRemainInJail(game);
      updateFunction(nextGame);

      if (
        nextGame.phase === GamePhase.uiTransition &&
        nextGame.transitionType === TransitionType.getOutOfJail
      ) {
        /** Wait for the UI to animate the transition */
        setTimeout(() => {
          const futureGame = triggerFirstPlayerTransition(nextGame);
          triggerUpdate(
            futureGame,
            { type: GameUpdateType.playerTransition },
            windowPlayerId,
            updateFunction,
          );
        }, playerTransitionDuration * 1000);
      }
    }
  } else if (gameUpdate.type === GameUpdateType.resume) {
    const validation = canResume(game, windowPlayerId);
    if (validation) {
      if (validation.game.reason === LiquidationReason.buyProperty) {
        updateFunction(resumeBuyProperty(validation.game));
      } else {
        updateFunction(resumePendingPayment(validation.game));
      }
    }
  } else if (gameUpdate.type === GameUpdateType.rollDice) {
    const validation = canRollDice(game, windowPlayerId);
    if (validation) {
      const nextGame = triggerDiceRoll(validation.game);
      updateFunction(nextGame);

      /** Wait for the UI to animate the transition */
      setTimeout(() => {
        triggerUpdate(nextGame, { type: GameUpdateType.postDice }, windowPlayerId, updateFunction);
      }, diceTransitionDuration * 2 * 1000);
    }
  } else if (gameUpdate.type === GameUpdateType.rollDiceInJail) {
    const validation = canRollDiceInJail(game, windowPlayerId);
    if (validation) {
      const nextGame = triggerDiceRollInJail(validation.game);
      updateFunction(nextGame);

      /** Wait for the UI to animate the transition */
      setTimeout(() => {
        triggerUpdate(
          nextGame,
          { type: GameUpdateType.postDiceInJail },
          windowPlayerId,
          updateFunction,
        );
      }, diceTransitionDuration * 2 * 1000);
    }
  } else if (gameUpdate.type === GameUpdateType.sellHouse) {
    const validation = canSellHouse(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      updateFunction(triggerSellHouse(validation.game, validation.street));
    }
  } else if (gameUpdate.type === GameUpdateType.sellingOffer) {
    const validation = canTriggerSellingOffer(
      game,
      gameUpdate.squareId,
      gameUpdate.amount,
      gameUpdate.targetPlayerId,
      windowPlayerId,
    );
    if (validation) {
      updateFunction(
        triggerSellingOffer(
          validation.game,
          validation.property,
          gameUpdate.amount,
          gameUpdate.targetPlayerId,
        ),
      );
    }
  } else if (gameUpdate.type === GameUpdateType.startTrade) {
    const validation = canStartTrade(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerStartTrade(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.tradeOffer) {
    const validation = canTriggerTradeOffer(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerTradeOffer(validation.game));
    }
  } else if (gameUpdate.type === GameUpdateType.toggleTradeSelection) {
    const validation = canToggleTradeSelection(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      updateFunction(triggerTradeSelectionToggle(validation.game, validation.property));
    }
  } else if (gameUpdate.type === GameUpdateType.useJailCard) {
    const validation = canUseJailCard(game, windowPlayerId);
    if (validation) {
      updateFunction(triggerUseJailCard(validation.game));
    }
  }
  // else if (gameUpdate.type) {}
};
