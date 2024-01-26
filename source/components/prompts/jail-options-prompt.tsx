import React from 'react';
import { JailMedium, PromptType } from '../../enums';
import { getCurrentPlayer } from '../../logic';
import { currencySymbol, jailFine, jailSymbol } from '../../parameters';
import { triggerDiceRoll, triggerGetOutOfJail } from '../../triggers';
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
            props.updateGame(triggerDiceRoll(props.game, true));
          }}
        >
          Roll dice
        </Button>

        <Button
          disabled={player.money < jailFine || player.turnsInJail === 2}
          onClick={() => {
            props.updateGame(triggerGetOutOfJail(props.game, JailMedium.fine));
          }}
        >
          Pay {currencySymbol}
          {jailFine} fine
        </Button>

        <Button
          disabled={!player.getOutOfJail}
          onClick={() => {
            props.updateGame(triggerGetOutOfJail(props.game, JailMedium.card));
          }}
        >
          Use Get out of Jail card
        </Button>
      </div>
    </div>
  );
};
