import React from 'react';
import { NotificationType, PromptType } from '../../enums';
import {
  diceToString,
  getCurrentPlayer,
  getOutOfJail,
  getsOutOfJail,
  remainInJail,
} from '../../logic';
import { currencySymbol, diceSymbol, jailSymbol } from '../../parameters';
import { applyDiceRoll, triggerDiceRoll, triggerEndTurn } from '../../triggers';
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
        turnsInJail: player.turnsInJail - 1,
        type: NotificationType.remainInJail,
      };

  return (
    <OkPrompt
      okHandler={() => {
        props.updateGame(
          escapesJail
            ? applyDiceRoll(getOutOfJail(props.game, notification))
            : triggerEndTurn(remainInJail(props.game, notification)),
        );
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
          {150} fine
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
