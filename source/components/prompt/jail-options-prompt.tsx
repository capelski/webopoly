import React from 'react';
import { NotificationType, PromptType } from '../../enums';
import {
  diceToString,
  getCurrentPlayer,
  getOutOfJail,
  getsOutOfJail,
  turnInJail,
} from '../../logic';
import { currencySymbol, diceSymbol, jailFine, jailSymbol } from '../../parameters';
import { applyDiceRoll, triggerDiceRoll } from '../../triggers';
import { Notification } from '../../types';
import { Button } from '../button';
import { NotificationComponent } from '../notification';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

const JailDiceRollPrompt: PromptInterface<PromptType.jailOptions> = (props) => {
  const player = getCurrentPlayer(props.game);
  const escapesJail = getsOutOfJail(player, props.game.dice);
  const notification: Notification = escapesJail
    ? {
        playerId: props.game.currentPlayerId,
        type: NotificationType.getOutOfJail,
      }
    : {
        playerId: props.game.currentPlayerId,
        turnsInJail: player.turnsInJail + 1,
        type: NotificationType.turnInJail,
      };

  return (
    <OkPrompt
      okHandler={() => {
        if (escapesJail) {
          props.updateGame(applyDiceRoll(getOutOfJail(props.game, { notification })));
        } else {
          let nextGame = turnInJail(props.game, notification);
          const currentPlayer = getCurrentPlayer(nextGame);
          const escapesJail = currentPlayer.turnsInJail === 3;

          if (escapesJail) {
            nextGame = getOutOfJail(nextGame, { paysJailFine: true });
            nextGame = applyDiceRoll(nextGame);
          }

          props.updateGame(nextGame);
        }
      }}
    >
      <h2>
        {diceSymbol} {diceToString(props.game.dice)}
      </h2>
      <div style={{ marginBottom: 16 }}>
        <NotificationComponent game={props.game} notification={notification} />
      </div>
    </OkPrompt>
  );
};

export const JailOptionsPrompt: PromptInterface<PromptType.jailOptions> = (props) => {
  const player = getCurrentPlayer(props.game);

  return props.prompt.hasRolledDice ? (
    <JailDiceRollPrompt {...props} />
  ) : (
    <div style={{ textAlign: 'center' }}>
      <h2>
        {jailSymbol}&nbsp;
        {player.name}
      </h2>
      <div>
        <Button
          onClick={() => {
            props.updateGame(triggerDiceRoll(props.game, true), true);
          }}
        >
          Roll dice
        </Button>

        <Button
          disabled={true}
          onClick={() => {
            // TODO
          }}
        >
          Pay {currencySymbol}
          {jailFine} fine
        </Button>

        <Button
          disabled={true}
          onClick={() => {
            // TODO
          }}
        >
          Use Get out of Jail card
        </Button>
      </div>
    </div>
  );
};
