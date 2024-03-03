import React from 'react';
import {
  currencySymbol,
  getCurrentPlayer,
  jailFine,
  PromptType,
  triggerDiceRollInJail,
  triggerPayJailFine,
  triggerUseJailCard,
} from '../../../../core';
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
          onClick={() => {
            props.updateGame(triggerDiceRollInJail(props.game));
          }}
        >
          Roll dice
        </Button>

        <Button
          disabled={player.money < jailFine || player.turnsInJail === 2}
          onClick={() => {
            props.updateGame(triggerPayJailFine(props.game));
          }}
        >
          Pay {currencySymbol}
          {jailFine} fine
        </Button>

        <Button
          disabled={!player.getOutOfJail}
          onClick={() => {
            props.updateGame(triggerUseJailCard(props.game));
          }}
        >
          Use Get out of Jail card
        </Button>
      </div>
    </div>
  );
};
