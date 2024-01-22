import React from 'react';
import { AnswerType, NotificationType, OfferType } from '../enums';
import {
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
  [NotificationType.getOutOfJail]: (player, _notification, game) => ({
    description: `${player.name} rolls ${game.dice.join('-')} and gets out of jail`,
    icon: '🎉',
  }),
  [NotificationType.goToJail]: (player) => ({
    description: `${player.name} goes to jail for 3 turns`,
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
  [NotificationType.remainInJail]: (player, notification) => ({
    description: `${player.name} remains in jail for ${
      notification.turnsInJail === 0 ? 'the last turn' : `${notification.turnsInJail} more turn(s)`
    }`,
    icon: jailSymbol,
  }),
  [NotificationType.sellHouse]: (player, notification, game) => {
    const square = getSquareById(game, notification.propertyId);
    return {
      description: `${player.name} sells a house in ${square.name}`,
      icon: '🏚️',
    };
  },
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
