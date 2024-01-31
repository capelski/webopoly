import React from 'react';
import { AnswerType, CardType, EventSource, EventType, JailMedium, OfferType } from '../../enums';
import {
  diceToString,
  getChanceCardById,
  getCommunityChestCardById,
  getPlayerById,
  getSquareById,
} from '../../logic';
import {
  chanceSymbol,
  communityChestSymbol,
  currencySymbol,
  getOutJailSymbol,
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailFine,
  jailSymbol,
  maxTurnsInJail,
  mortgageSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../../parameters';
import { Game, GEvent, Player } from '../../types';

type Renderer<T = EventType> = (
  player: Player,
  event: GEvent & { type: T },
  game: Game,
) => {
  description: string;
  icon: string;
};

const renderersMap: {
  [TKey in EventType]: false | Renderer<TKey>;
} = {
  [EventType.answerOffer]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    const owner = getPlayerById(game, event.targetPlayerId);
    const acceptsOffer = event.answer === AnswerType.accept;
    const isBuyingOffer = event.offerType === OfferType.buy;
    return {
      description: `${player.name} ${acceptsOffer ? 'accepts' : 'declines'} ${currencySymbol}${
        event.amount
      } ${isBuyingOffer ? 'BUY' : 'SELL'} offer for ${square.name} from ${owner.name}`,
      icon: event.answer === AnswerType.accept ? '👍' : '👎',
    };
  },
  [EventType.bankruptcy]: (player, event, game) => ({
    description: `${player.name} goes bankrupt and turns over its money and properties to ${
      event.creditorId ? getPlayerById(game, event.creditorId).name : 'the bank'
    }`,
    icon: '🧨',
  }),
  [EventType.buildHouse]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} builds a house in ${square.name}`,
      icon: houseSymbol,
    };
  },
  [EventType.buyProperty]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} buys ${square.name}`,
      icon: '💵',
    };
  },
  [EventType.card]: (player, event) =>
    event.cardType === CardType.chance
      ? {
          description: `${player.name}: ${getChanceCardById(event.cardId).text}`,
          icon: chanceSymbol,
        }
      : {
          description: `${player.name}: ${getCommunityChestCardById(event.cardId).text}`,
          icon: communityChestSymbol,
        },
  [EventType.clearMortgage]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} clears the mortgage on ${square.name}`,
      icon: '❎',
    };
  },
  [EventType.expense]: (player, event) =>
    event.source === EventSource.chanceCard
      ? {
          description: `${player.name}: ${getChanceCardById(event.cardId).text}`,
          icon: chanceSymbol,
        }
      : event.source === EventSource.communityChestCard
      ? {
          description: `${player.name}: ${getCommunityChestCardById(event.cardId).text}`,
          icon: communityChestSymbol,
        }
      : {
          description: `${player.name} pays ${currencySymbol}${event.amount} in taxes`,
          icon: taxSymbol,
        },
  [EventType.freeParking]: (player, event) => ({
    description: `${player.name} collects ${currencySymbol}${event.pot} from Free Parking`,
    icon: parkingSymbol,
  }),
  [EventType.getOutOfJail]: (player, event, game) => {
    const reason =
      event.medium === JailMedium.card
        ? 'uses Get Out of Jail Free card'
        : event.medium === JailMedium.dice
        ? `rolls ${diceToString(game.dice)} and gets out of jail`
        : `pays ${currencySymbol}${jailFine} fine to get out of jail`;
    return {
      description: `${player.name} ${reason}`,
      icon: getOutJailSymbol,
    };
  },
  [EventType.goToJail]: (player, event) => ({
    description: `${player.name} goes to jail`,
    icon:
      event.source === EventSource.chanceCard
        ? chanceSymbol
        : event.source === EventSource.communityChestCard
        ? communityChestSymbol
        : goToJailSymbol,
  }),
  [EventType.mortgage]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} mortgages ${square.name}`,
      icon: mortgageSymbol,
    };
  },
  [EventType.passGo]: (player) => ({
    description: `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    icon: goSymbol,
  }),
  [EventType.payRent]: (player, event, game) => {
    const landlord = getPlayerById(game, event.landlordId)!;
    return {
      description: `${player.name} pays ${currencySymbol}${event.amount} rent to ${landlord.name}`,
      icon: '🚀',
    };
  },
  [EventType.sellHouse]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} sells a house in ${square.name}`,
      icon: '🏚️',
    };
  },
  [EventType.turnInJail]: (player, event) => ({
    description: `${player.name} doesn't roll doubles; ${
      event.turnsInJail < maxTurnsInJail
        ? `${event.turnsInJail} turn(s) in jail`
        : `pays ${currencySymbol}${jailFine} fine and gets out`
    }`,
    icon: jailSymbol,
  }),
};

interface EventComponentProps {
  event: GEvent;
  game: Game;
}

export const EventComponent: React.FC<EventComponentProps> = (props) => {
  const renderer = renderersMap[props.event.type] as Renderer;

  if (!renderer) {
    return undefined;
  }

  const player = getPlayerById(props.game, props.event.playerId);
  const { description, icon } = renderer(player, props.event, props.game);

  return (
    <div>
      <span>{icon}</span>
      <span style={{ paddingLeft: 8 }}>{description}</span>
    </div>
  );
};
