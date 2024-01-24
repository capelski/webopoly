import React from 'react';
import { AnswerType, JailMedium, NotificationType, OfferType } from '../enums';
import {
  diceToString,
  getChanceCardById,
  getCommunityChestCardById,
  getPlayerById,
  getSquareById,
} from '../logic';
import {
  chanceSymbol,
  communityChestSymbol,
  currencySymbol,
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailFine,
  jailSymbol,
  mortgageSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../parameters';
import { Game, Notification, Player } from '../types';

type Renderer<T = NotificationType> = (
  player: Player,
  notification: Notification & { type: T },
  game: Game,
) => {
  description: string;
  icon: string;
};

const renderersMap: {
  [TKey in NotificationType]: false | Renderer<TKey>;
} = {
  [NotificationType.answerOffer]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    const owner = getPlayerById(game, notification.targetPlayerId);
    const acceptsOffer = notification.answer === AnswerType.accept;
    const isBuyingOffer = notification.offerType === OfferType.buy;
    return {
      description: `${player.name} ${acceptsOffer ? 'accepts' : 'declines'} ${currencySymbol}${
        notification.amount
      } ${isBuyingOffer ? 'BUY' : 'SELL'} offer for ${square.name} from ${owner.name}`,
      icon: notification.answer === AnswerType.accept ? '👍' : '👎',
    };
  },
  [NotificationType.bankruptcy]: (player) => ({
    description: `${player.name} goes bankrupt`,
    icon: '🧨',
  }),
  [NotificationType.buildHouse]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} builds a house in ${square.name}`,
      icon: houseSymbol,
    };
  },
  [NotificationType.buyProperty]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} buys ${square.name}`,
      icon: '💵',
    };
  },
  [NotificationType.chance]: (player, notification) => ({
    description: `${player.name}: ${getChanceCardById(notification.cardId).text}`,
    icon: chanceSymbol,
  }),
  [NotificationType.clearMortgage]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} clears the mortgage on ${square.name}`,
      icon: '❎',
    };
  },
  [NotificationType.communityChest]: (player, notification) => ({
    description: `${player.name}: ${getCommunityChestCardById(notification.cardId).text}`,
    icon: communityChestSymbol,
  }),
  [NotificationType.freeParking]: (player, notification) => ({
    description: `${player.name} collects ${currencySymbol}${notification.pot} from Free Parking`,
    icon: parkingSymbol,
  }),
  [NotificationType.getOutOfJail]: (player, notification, game) => {
    const reason =
      notification.medium === JailMedium.dice
        ? `rolls ${diceToString(game.dice)}`
        : `pays ${currencySymbol}${jailFine}`;
    return {
      description: `${player.name} ${reason} and gets out of jail`,
      icon: '🎉',
    };
  },
  [NotificationType.goToJail]: (player) => ({
    description: `${player.name} goes to jail`,
    icon: goToJailSymbol,
  }),
  [NotificationType.mortgage]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} mortgages ${square.name}`,
      icon: mortgageSymbol,
    };
  },
  [NotificationType.passGo]: (player) => ({
    description: `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    icon: goSymbol,
  }),
  [NotificationType.payRent]: (player, notification, game) => {
    const landlord = getPlayerById(game, notification.landlordId)!;
    return {
      description: `${player.name} pays ${currencySymbol}${notification.rent} rent to ${landlord.name}`,
      icon: '🚀',
    };
  },
  [NotificationType.payTax]: (player, notification) => ({
    description: `${player.name} pays ${currencySymbol}${notification.tax} in taxes`,
    icon: taxSymbol,
  }),
  [NotificationType.sellHouse]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} sells a house in ${square.name}`,
      icon: '🏚️',
    };
  },
  [NotificationType.turnInJail]: (player, notification) => ({
    description: `${player.name} doesn't roll doubles; ${
      notification.turnsInJail === 1
        ? '1st turn in jail'
        : notification.turnsInJail === 2
        ? '2nd turn in jail'
        : `${currencySymbol}${jailFine} fine to get out`
    }`,
    icon: jailSymbol,
  }),
};

interface NotificationComponentProps {
  notification: Notification;
  game: Game;
}

export const NotificationComponent: React.FC<NotificationComponentProps> = (props) => {
  const renderer = renderersMap[props.notification.type] as Renderer;

  if (!renderer) {
    return undefined;
  }

  const player = getPlayerById(props.game, props.notification.playerId);
  const { description, icon } = renderer(player, props.notification, props.game);

  return (
    <div>
      <span>{icon}</span>
      <span style={{ paddingLeft: 8 }}>{description}</span>
    </div>
  );
};
