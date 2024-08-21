import { defaultActionInterval, maxTurnsInJail } from '../constants';
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
import {
  clearNotifications,
  getActivePlayers,
  getCurrentPlayer,
  isDoublesRoll,
  turnConsiderations,
} from '../logic';
import { DefaultAction, Game, GameUpdate, Player } from '../types';
import {
  canAnswerOffer,
  canAnswerTrade,
  canApplyCard,
  canBuildHouse,
  canBuyProperty,
  canCancelTrade,
  canClearMortgage,
  canDeclareBankruptcy,
  canDrawCard,
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
import { triggerApplyCard, triggerDrawCard } from './cards';
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

export const triggerRemovePlayer = (
  game: Game,
  playerId: Player['id'],
  updateFunction: (game: Game) => void,
) => {
  let defaultAction: DefaultAction | undefined;

  if (game.defaultAction) {
    defaultAction = { ...game.defaultAction };
    clearTimeout(game.defaultAction.timer);
    game.defaultAction = undefined;
  }

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

  /* If the player was on the list of potential buyer ids, remove it */
  if (
    game.phase === GamePhase.prompt &&
    game.prompt.type === PromptType.buyProperty &&
    game.prompt.potentialBuyersId.includes(playerId)
  ) {
    game.prompt.potentialBuyersId = game.prompt.potentialBuyersId.filter((id) => id != playerId);
  }

  /* If it was the player turn, end the turn on their behalf */
  if (getCurrentPlayer(nextGame, { omitTurnConsiderations: true }).id === playerId) {
    nextGame = triggerEndTurn({ ...nextGame, phase: GamePhase.play });
  }

  const remainingPlayers = getActivePlayers(nextGame);
  if (remainingPlayers.length === 1) {
    nextGame = {
      ...nextGame,
      currentPlayerId: remainingPlayers[0].id,
      phase: GamePhase.prompt,
      prompt: {
        playerId: remainingPlayers[0].id,
        type: PromptType.playerWins,
      },
    };
  } else if (defaultAction && defaultAction.playerId !== playerId) {
    nextGame.defaultAction = { ...defaultAction };
  }

  updateFunction(nextGame);
  setDefaultTrigger(nextGame, updateFunction);
};

export const setDefaultTrigger = (game: Game, updateFunction: (game: Game) => void) => {
  if (game.defaultAction) {
    game.defaultAction.timer = setTimeout(() => {
      triggerUpdate(
        clearNotifications(game),
        game.defaultAction!.update,
        game.defaultAction!.playerId,
        updateFunction,
      );
    }, game.defaultAction.interval ?? defaultActionInterval * 1000);
  }
};

export const triggerUpdate = (
  game: Game,
  gameUpdate: GameUpdate,
  windowPlayerId: Player['id'],
  updateFunction: (game: Game) => void,
) => {
  let defaultAction: DefaultAction | undefined;

  if (game.defaultAction) {
    defaultAction = { ...game.defaultAction };
    clearTimeout(game.defaultAction?.timer);
    delete game.defaultAction;
  }

  let nextGame = game;

  if (gameUpdate.type === GameUpdateType.acceptOffer) {
    const validation = canAnswerOffer(game, windowPlayerId);
    if (validation) {
      nextGame = triggerAcceptOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.acceptTrade) {
    const validation = canAnswerTrade(game, windowPlayerId);
    if (validation) {
      nextGame = triggerAcceptTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.applyCard) {
    const validation = canApplyCard(game, windowPlayerId);
    if (validation) {
      nextGame = triggerApplyCard(validation.game, validation.game.prompt.cardId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.bankruptcy) {
    const validation = canDeclareBankruptcy(game, windowPlayerId);
    if (validation) {
      nextGame = triggerBankruptcy(validation.game, windowPlayerId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buildHouse) {
    const validation = canBuildHouse(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerBuildHouse(validation.game, validation.street);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyingOffer) {
    const validation = canTriggerBuyingOffer(
      game,
      gameUpdate.squareId,
      gameUpdate.amount,
      windowPlayerId,
    );
    if (validation) {
      nextGame = triggerBuyingOffer(validation.game, validation.property, gameUpdate.amount);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyProperty) {
    const validation = canBuyProperty(game, windowPlayerId);
    if (validation) {
      nextGame = triggerBuyProperty(validation.game, validation.square, windowPlayerId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyPropertyReject) {
    const validation = canRejectProperty(game, windowPlayerId);
    if (validation) {
      nextGame = triggerRejectProperty(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyPropertyLiquidation) {
    const validation = canLiquidateBuyProperty(game, windowPlayerId);
    if (validation) {
      nextGame = triggerBuyPropertyLiquidation(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.cancelTrade) {
    const validation = canCancelTrade(game, windowPlayerId);
    if (validation) {
      nextGame = triggerCancelTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.clearMortgage) {
    const validation = canClearMortgage(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerClearMortgage(validation.game, validation.property);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.declineOffer) {
    const validation = canAnswerOffer(game, windowPlayerId);
    if (validation) {
      nextGame = triggerDeclineOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.declineTrade) {
    const validation = canAnswerTrade(game, windowPlayerId);
    if (validation) {
      nextGame = triggerDeclineTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.drawCard) {
    const validation = canDrawCard(game, windowPlayerId);
    if (validation) {
      nextGame = triggerDrawCard(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.endTurn) {
    const validation = canEndTurn(game, windowPlayerId);
    if (validation) {
      nextGame = triggerEndTurn(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.getOutOfJail) {
    if (
      nextGame.phase === GamePhase.uiTransition &&
      nextGame.transitionType === TransitionType.getOutOfJail
    ) {
      nextGame = triggerFirstPlayerTransition(nextGame);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.goToJail) {
    const validation = mustGoToJail(game, windowPlayerId);
    if (validation) {
      nextGame = triggerGoToJail(
        validation.game,
        validation.game.prompt.type === PromptType.applyCard,
      );
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.pendingPaymentLiquidation) {
    const validation = canLiquidatePendingPayment(game, windowPlayerId);
    if (validation) {
      nextGame = triggerPendingPaymentLiquidation(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.mortgage) {
    const validation = canMortgage(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerMortgage(validation.game, validation.property);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.payJailFine) {
    const validation = canPayJailFine(game, windowPlayerId);
    if (validation) {
      nextGame = triggerPayJailFine(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.playerTransition) {
    if (game.phase === GamePhase.uiTransition && game.transitionType === TransitionType.player) {
      nextGame = triggerNextPlayerTransition(game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.postDice) {
    if (game.phase === GamePhase.uiTransition && game.transitionType === TransitionType.dice) {
      nextGame = triggerFirstPlayerTransition(game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.postDiceInJail) {
    if (
      game.phase === GamePhase.uiTransition &&
      game.transitionType === TransitionType.jailDiceRoll
    ) {
      const currentPlayer = getCurrentPlayer(game);
      const isDoubles = isDoublesRoll(game.dice);
      const isLastTurnInJail = currentPlayer.turnsInJail === maxTurnsInJail - 1;

      nextGame = isDoubles
        ? triggerRollDoublesInJail(game)
        : isLastTurnInJail
        ? triggerLastTurnInJail(game)
        : triggerRemainInJail(game);

      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.resume) {
    const validation = canResume(game, windowPlayerId);
    if (validation) {
      if (validation.game.reason === LiquidationReason.buyProperty) {
        nextGame = resumeBuyProperty(validation.game);
        updateFunction(nextGame);
      } else {
        nextGame = resumePendingPayment(validation.game);
        updateFunction(nextGame);
      }
    }
  } else if (gameUpdate.type === GameUpdateType.rollDice) {
    const validation = canRollDice(game, windowPlayerId);
    if (validation) {
      nextGame = triggerDiceRoll(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.rollDiceInJail) {
    const validation = canRollDiceInJail(game, windowPlayerId);
    if (validation) {
      nextGame = triggerDiceRollInJail(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.sellHouse) {
    const validation = canSellHouse(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerSellHouse(validation.game, validation.street);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
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
      nextGame = triggerSellingOffer(
        validation.game,
        validation.property,
        gameUpdate.amount,
        gameUpdate.targetPlayerId,
      );
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.startTrade) {
    const validation = canStartTrade(game, windowPlayerId);
    if (validation) {
      nextGame = triggerStartTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.tradeOffer) {
    const validation = canTriggerTradeOffer(game, windowPlayerId);
    if (validation) {
      nextGame = triggerTradeOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.toggleTradeSelection) {
    const validation = canToggleTradeSelection(game, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerTradeSelectionToggle(validation.game, validation.property);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.useJailCard) {
    const validation = canUseJailCard(game, windowPlayerId);
    if (validation) {
      nextGame = triggerUseJailCard(validation.game);
      updateFunction(nextGame);
    }
  }
  // else if (gameUpdate.type) {} // type should always be inferred as never

  if (game.defaultAction !== nextGame.defaultAction) {
    setDefaultTrigger(nextGame, updateFunction);
  }
};
