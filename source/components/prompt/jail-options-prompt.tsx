import React from 'react';
import { JailMedium, NotificationType, PromptType } from '../../enums';
import {
  diceToString,
  getCurrentPlayer,
  getOutOfJail,
  getsOutOfJail,
  turnInJail,
} from '../../logic';
import { currencySymbol, diceSymbol, jailFine, jailSymbol } from '../../parameters';
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
        medium: JailMedium.dice,
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
          props.updateGame(
            applyDiceRoll(getOutOfJail(props.game, { pastNotification: notification })),
          );
        } else {
          let nextGame = turnInJail(props.game);
          const currentPlayer = getCurrentPlayer(nextGame);
          const escapesJail = currentPlayer.turnsInJail === 3;

          if (escapesJail) {
            nextGame = getOutOfJail(nextGame, {
              pastNotification: notification,
              paysJailFine: true,
            });
            nextGame = applyDiceRoll(nextGame);
          } else {
            nextGame.pastNotifications = [notification, ...nextGame.pastNotifications];
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
          disabled={player.money < jailFine || player.turnsInJail === 2}
          onClick={() => {
            props.updateGame(
              triggerEndTurn(
                getOutOfJail(props.game, {
                  notification: {
                    medium: JailMedium.fine,
                    playerId: props.game.currentPlayerId,
                    type: NotificationType.getOutOfJail,
                  },
                  paysJailFine: true,
                }),
              ),
            );
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
