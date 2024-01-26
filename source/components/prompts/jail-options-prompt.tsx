import React from 'react';
import { JailMedium, NotificationType, PromptType } from '../../enums';
import { diceToString, getCurrentPlayer, isDoublesRoll } from '../../logic';
import { currencySymbol, diceSymbol, jailFine, jailSymbol, maxTurnsInJail } from '../../parameters';
import {
  applyDiceRoll,
  triggerDiceRoll,
  triggerEndTurn,
  triggerGetOutOfJail,
  triggerTurnInJail,
} from '../../triggers';
import { Button } from '../common/button';
import { NotificationComponent } from '../common/notification';
import { OkPrompt } from './ok-prompt';
import { PromptInterface } from './prompt-interface';

const JailDiceRollPrompt: PromptInterface<PromptType.jailOptions> = (props) => {
  const player = getCurrentPlayer(props.game);
  const isDoubles = isDoublesRoll(props.game.dice);

  return (
    <OkPrompt
      okHandler={() => {
        let nextGame = props.game;

        if (isDoubles) {
          nextGame = triggerGetOutOfJail(nextGame, JailMedium.dice);
          nextGame = applyDiceRoll(nextGame);
        } else {
          nextGame = triggerTurnInJail(nextGame);
          const currentPlayer = getCurrentPlayer(nextGame);
          const isLastTurnInJail = currentPlayer.turnsInJail === maxTurnsInJail;

          if (isLastTurnInJail) {
            nextGame = triggerGetOutOfJail(nextGame, JailMedium.lastTurn);
            nextGame = applyDiceRoll(nextGame);
          }
        }

        props.updateGame(nextGame);
      }}
    >
      <h2>
        {diceSymbol} {diceToString(props.game.dice)}
      </h2>
      <div style={{ marginBottom: 16 }}>
        <NotificationComponent
          game={props.game}
          notification={
            isDoubles
              ? {
                  medium: JailMedium.dice,
                  playerId: props.game.currentPlayerId,
                  type: NotificationType.getOutOfJail,
                }
              : {
                  playerId: props.game.currentPlayerId,
                  turnsInJail: player.turnsInJail + 1,
                  type: NotificationType.turnInJail,
                }
          }
        />
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
            let nextGame = props.game;

            nextGame = triggerGetOutOfJail(nextGame, JailMedium.fine);
            nextGame = triggerEndTurn(nextGame);

            props.updateGame(nextGame);
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
