import {
  canPayJailFine,
  canRollDiceInJail,
  canUseJailCard,
  currencySymbol,
  GameUpdateType,
  getCurrentPlayer,
  jailFine,
  PromptType,
} from '@webopoly/core';
import React from 'react';
import { jailSymbol } from '../../parameters';
import { Button } from '../common/button';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const JailOptionsPrompt: PromptInterface<PromptType.jailOptions> = (props) => {
  const player = getCurrentPlayer(props.game);

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>
        {jailSymbol}&nbsp;
        {player.name}
      </Title>
      <div>
        <Button
          disabled={!canRollDiceInJail(props.game, props.windowPlayerId)}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.rollDiceInJail });
          }}
        >
          Roll dice
        </Button>

        <Button
          disabled={!canPayJailFine(props.game, props.windowPlayerId)}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.payJailFine });
          }}
        >
          Pay {currencySymbol}
          {jailFine} fine
        </Button>

        <Button
          disabled={!canUseJailCard(props.game, props.windowPlayerId)}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.useJailCard });
          }}
        >
          Use Get out of Jail card
        </Button>
      </div>
    </div>
  );
};
