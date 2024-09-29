import { GameUpdateType } from '../enums';
import { Player } from './player';
import { Square } from './square';

export type GameUpdate =
  | {
      type:
        | GameUpdateType.acceptOffer
        | GameUpdateType.acceptTrade
        | GameUpdateType.applyCard
        | GameUpdateType.bankruptcy
        | GameUpdateType.buyPropertyAccept
        | GameUpdateType.buyPropertyDecline
        | GameUpdateType.buyingLiquidation
        | GameUpdateType.cancelTrade
        | GameUpdateType.declineOffer
        | GameUpdateType.declineTrade
        | GameUpdateType.drawCard
        | GameUpdateType.endTurn
        | GameUpdateType.getOutOfJail
        | GameUpdateType.goToJail
        | GameUpdateType.payJailFine
        | GameUpdateType.paymentLiquidation
        | GameUpdateType.playerTransition
        | GameUpdateType.postDice
        | GameUpdateType.postDiceInJail
        | GameUpdateType.resume
        | GameUpdateType.rollDice
        | GameUpdateType.rollDiceInJail
        | GameUpdateType.startTrade
        | GameUpdateType.tradeOffer
        | GameUpdateType.useJailCard;
    }
  | {
      squareId: Square['id'];
      type:
        | GameUpdateType.buildHouse
        | GameUpdateType.clearMortgage
        | GameUpdateType.mortgage
        | GameUpdateType.sellHouse
        | GameUpdateType.toggleTradeSelection;
    }
  | {
      amount: number;
      squareId: Square['id'];
      type: GameUpdateType.buyingOffer;
    }
  | {
      amount: number;
      squareId: Square['id'];
      targetPlayerId: Player['id'];
      type: GameUpdateType.sellingOffer;
    };
