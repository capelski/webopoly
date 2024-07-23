import {
  AnswerType,
  currencySymbol,
  diceToString,
  EventType,
  Game,
  getCardText,
  getPlayerById,
  getSquareById,
  GEvent,
  jailFine,
  JailMedium,
  maxTurnsInJail,
  OfferType,
  passGoMoney,
  Player,
} from '@webopoly/core';
import React from 'react';
import {
  clearMortgageSymbol,
  getOutJailSymbol,
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailSymbol,
  mortgageSymbol,
  parkingSymbol,
  sellHouseSymbol,
  surpriseSymbol,
  taxSymbol,
} from '../../parameters';
import { Paragraph } from './paragraph';

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
      } ${isBuyingOffer ? 'buy' : 'sell'} offer for ${square.name} from ${owner.name}`,
      icon: event.answer === AnswerType.accept ? '👍' : '👎',
    };
  },
  [EventType.answerTrade]: (player, event, game) => {
    const initiatorProperties = event.playerPropertiesId.map(
      (pId) => getSquareById(game, pId).name,
    );
    const targetPlayer = getPlayerById(game, event.targetPlayerId);
    const targetProperties = event.targetPropertiesId.map((pId) => getSquareById(game, pId).name);
    const acceptsOffer = event.answer === AnswerType.accept;

    return {
      description: `${targetPlayer.name} ${
        acceptsOffer ? 'trades' : 'declines trading'
      } ${initiatorProperties.join('-')} for ${targetProperties.join('-')} with ${player.name}`,
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
  [EventType.card]: (player, event) => ({
    description: `${player.name}: ${getCardText(event.cardId, event.amount)}`,
    icon: surpriseSymbol,
  }),
  [EventType.clearMortgage]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} clears the mortgage on ${square.name}`,
      icon: clearMortgageSymbol,
    };
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
  [EventType.goToJail]: (player) => ({
    description: `${player.name} goes to jail`,
    icon: goToJailSymbol,
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
  [EventType.payTax]: (player, event) => ({
    description: `${player.name} pays ${currencySymbol}${event.amount} in taxes`,
    icon: taxSymbol,
  }),
  [EventType.playerExit]: (player) => ({
    description: `${player.name} has exited the game`,
    icon: '☠️',
  }),
  [EventType.sellHouse]: (player, event, game) => {
    const square = getSquareById(game, event.propertyId);
    return {
      description: `${player.name} sells a house in ${square.name}`,
      icon: sellHouseSymbol,
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
      <Paragraph type="small">
        <span>{icon}</span>
        <span style={{ paddingLeft: 8 }}>{description}</span>
      </Paragraph>
    </div>
  );
};
