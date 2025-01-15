import { defaultActionInterval, maxTurnsInJail } from '../constants';
import {
  EventType,
  GamePhase,
  GameUpdateType,
  PlayerStatus,
  PropertyType,
  SquareType,
} from '../enums';
import {
  clearNotifications,
  exceedsMaxDoublesInARow,
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
import { triggerAvatarAnimation } from './avatar-animation';
import { triggerBankruptcy } from './bankruptcy';
import { triggerBuyPropertyAccept, triggerBuyPropertyDecline } from './buy-property';
import { triggerApplyCard, triggerDrawCard } from './cards';
import { triggerApplyDiceRoll, triggerDiceRoll, triggerDiceRollInJail } from './dice-roll';
import { triggerEndTurn } from './end-turn';
import { triggerBuildHouse, triggerSellHouse } from './houses';
import {
  triggerGoToJail,
  triggerLastTurnInJail,
  triggerNotifyJail,
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
  triggerStartTrade_play,
  triggerStartTrade_rollDice,
  triggerTradeOffer,
  triggerTradeSelectionToggle,
} from './trade';

export const triggerRemovePlayer = (
  game: Game<any>,
  playerId: Player['id'],
  updateFunction: (game: Game<any>) => void,
) => {
  let defaultAction: DefaultAction | undefined;

  if (game.defaultAction) {
    defaultAction = { ...game.defaultAction };
    clearTimeout(game.defaultAction.timer);
    game.defaultAction = undefined;
  }

  let nextGame: Game<any> = {
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
      ? triggerBuyPropertyDecline(buyingProperty.game)
      : buyingPropertyLiquidation && buyingPropertyLiquidation.currentPlayerId === playerId
      ? triggerBuyPropertyDecline(resumeBuyProperty(buyingPropertyLiquidation.game))
      : nextGame;

  /* If the player was on the list of potential buyer ids, remove it */
  if (game.phase === GamePhase.buyProperty && game.phaseData.potentialBuyersId.includes(playerId)) {
    game.phaseData.potentialBuyersId = game.phaseData.potentialBuyersId.filter(
      (id) => id != playerId,
    );
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
      phase: GamePhase.playerWins,
      phaseData: {
        playerId: remainingPlayers[0].id,
      },
    };
  } else if (defaultAction && defaultAction.playerId !== playerId) {
    nextGame.defaultAction = { ...defaultAction };
  }

  updateFunction(nextGame);
  setDefaultTrigger(nextGame, updateFunction);
};

export const setDefaultTrigger = (game: Game<any>, updateFunction: (game: Game<any>) => void) => {
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
  game: Game<any>,
  gameUpdate: GameUpdate,
  windowPlayerId: Player['id'],
  updateFunction: (game: Game<any>) => void,
) => {
  let defaultAction: DefaultAction | undefined;

  if (game.defaultAction) {
    defaultAction = { ...game.defaultAction };
    clearTimeout(game.defaultAction?.timer);
    delete game.defaultAction;
  }

  let nextGame = game;

  if (gameUpdate.type === GameUpdateType.acceptOffer) {
    const validation = canAnswerOffer(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerAcceptOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.acceptTrade) {
    const validation = canAnswerTrade(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerAcceptTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.animateAvatarOutOfJail) {
    if (nextGame.phase === GamePhase.outOfJailAnimation) {
      nextGame = triggerAvatarAnimation(nextGame);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.applyCard) {
    const validation = canApplyCard(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerApplyCard(validation.game, validation.game.phaseData.cardId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.applyDiceRoll) {
    if (nextGame.phase === GamePhase.avatarAnimation) {
      nextGame = triggerApplyDiceRoll(nextGame);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.bankruptcy) {
    const validation = canDeclareBankruptcy(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerBankruptcy(validation.game, windowPlayerId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buildHouse) {
    const validation = canBuildHouse(nextGame, gameUpdate.squareId, windowPlayerId);
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
  } else if (gameUpdate.type === GameUpdateType.buyPropertyAccept) {
    const validation = canBuyProperty(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerBuyPropertyAccept(validation.game, validation.square, windowPlayerId);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyPropertyDecline) {
    const validation = canRejectProperty(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerBuyPropertyDecline(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.buyingLiquidation) {
    const validation = canLiquidateBuyProperty(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerBuyPropertyLiquidation(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.cancelTrade) {
    const validation = canCancelTrade(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerCancelTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.clearMortgage) {
    const validation = canClearMortgage(nextGame, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerClearMortgage(validation.game, validation.property);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.declineOffer) {
    const validation = canAnswerOffer(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerDeclineOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.declineTrade) {
    const validation = canAnswerTrade(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerDeclineTrade(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.drawCard) {
    const validation = canDrawCard(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerDrawCard(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.endTurn) {
    const validation = canEndTurn(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerEndTurn(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.evaluateDiceRoll) {
    if (nextGame.phase === GamePhase.diceAnimation) {
      const currentPlayer = getCurrentPlayer(game);

      if (exceedsMaxDoublesInARow(currentPlayer.doublesInARow)) {
        nextGame = triggerNotifyJail(nextGame);
      } else {
        nextGame = triggerAvatarAnimation(nextGame);
      }

      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.evaluateDiceRollInJail) {
    if (nextGame.phase === GamePhase.diceInJailAnimation) {
      const currentPlayer = getCurrentPlayer(nextGame);
      const isDoubles = isDoublesRoll(nextGame.dice);
      const isLastTurnInJail = currentPlayer.turnsInJail === maxTurnsInJail - 1;

      nextGame = isDoubles
        ? triggerRollDoublesInJail(nextGame)
        : isLastTurnInJail
        ? triggerLastTurnInJail(nextGame)
        : triggerRemainInJail(nextGame);

      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.goToJail) {
    const validation = mustGoToJail(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerGoToJail(validation.game, validation.game.phase === GamePhase.applyCard);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.paymentLiquidation) {
    const validation = canLiquidatePendingPayment(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerPendingPaymentLiquidation(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.mortgage) {
    const validation = canMortgage(nextGame, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerMortgage(validation.game, validation.property);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.payJailFine) {
    const validation = canPayJailFine(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerPayJailFine(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.resume) {
    const validation = canResume(nextGame, windowPlayerId);
    if (validation) {
      if (validation.game.phase === GamePhase.buyingLiquidation) {
        nextGame = resumeBuyProperty(validation.game);
        updateFunction(nextGame);
      } else {
        nextGame = resumePendingPayment(validation.game);
        updateFunction(nextGame);
      }
    }
  } else if (gameUpdate.type === GameUpdateType.rollDice) {
    const validation = canRollDice(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerDiceRoll(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.rollDiceInJail) {
    const validation = canRollDiceInJail(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerDiceRollInJail(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.sellHouse) {
    const validation = canSellHouse(nextGame, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerSellHouse(validation.game, validation.street);
      nextGame.defaultAction = defaultAction;
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.sellingOffer) {
    const validation = canTriggerSellingOffer(
      nextGame,
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
    const validation = canStartTrade(nextGame, windowPlayerId);
    if (validation) {
      nextGame =
        validation.game.phase === GamePhase.play
          ? triggerStartTrade_play(validation.game)
          : triggerStartTrade_rollDice(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.tradeOffer) {
    const validation = canTriggerTradeOffer(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerTradeOffer(validation.game);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.toggleTradeSelection) {
    const validation = canToggleTradeSelection(nextGame, gameUpdate.squareId, windowPlayerId);
    if (validation) {
      nextGame = triggerTradeSelectionToggle(validation.game, validation.property);
      updateFunction(nextGame);
    }
  } else if (gameUpdate.type === GameUpdateType.useJailCard) {
    const validation = canUseJailCard(nextGame, windowPlayerId);
    if (validation) {
      nextGame = triggerUseJailCard(validation.game);
      updateFunction(nextGame);
    }
  }
  // else if (gameUpdate.type) {} // type should always be inferred as never

  if (nextGame.defaultAction !== game.defaultAction) {
    setDefaultTrigger(nextGame, updateFunction);
  }
};
