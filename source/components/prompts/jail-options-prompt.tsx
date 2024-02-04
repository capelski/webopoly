import React from 'react';
import { PromptType } from '../../enums';
import { getCurrentPlayer } from '../../logic';
import { currencySymbol, jailFine, jailSymbol } from '../../parameters';
import { triggerDiceRollInJail, triggerPayJailFine, triggerUseJailCard } from '../../triggers';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const JailOptionsPrompt: PromptInterface<PromptType.jailOptions> = (props) => {
  const player = getCurrentPlayer(props.game);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>
        {jailSymbol}&nbsp;
        {player.name}
      </h2>
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
