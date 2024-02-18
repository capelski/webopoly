import React, { useEffect, useState } from 'react';
import { GamePhase, TransitionType } from '../../enums';
import { diceToString, getCurrentPlayer, isDoublesRoll } from '../../logic';
import {
  currencySymbol,
  diceSymbol,
  diceTransitionDuration,
  maxTurnsInJail,
  parkingSymbol,
  playerTransitionDuration,
} from '../../parameters';
import {
  triggerFirstPlayerTransition,
  triggerLastTurnInJail,
  triggerNextPlayerTransition,
  triggerRemainInJail,
  triggerRollDoublesInJail,
} from '../../triggers';
import { Game } from '../../types';
import { Grid } from './grid';
import { InnerBottomRow } from './inner-rows/inner-bottom-row';
import { InnerLeftRow } from './inner-rows/inner-left-row';
import { InnerRightRow } from './inner-rows/inner-right-row';
import { InnerTopRow } from './inner-rows/inner-top-row';
import { OuterBottomRow } from './outer-rows/outer-bottom-row';
import { OuterLeftRow } from './outer-rows/outer-left-row';
import { OuterRightRow } from './outer-rows/outer-right-row';
import { OuterTopRow } from './outer-rows/outer-top-row';

interface BoardProps {
  game: Game;
  isDesktop: boolean;
  updateGame: (game: Game | undefined) => void;
}

export const Board: React.FC<BoardProps> = (props) => {
  const [animateDice, setAnimateDice] = useState(false);

  useEffect(() => {
    if (props.game.notifications.length) {
      // Wait for the notifications to be processed before triggering animations
      return;
    }

    if (props.game.phase === GamePhase.uiTransition) {
      const { game } = props;

      if (game.transitionType === TransitionType.player) {
        setTimeout(() => {
          props.updateGame(triggerNextPlayerTransition(game));
        }, playerTransitionDuration * 1000);
      } else if (game.transitionType === TransitionType.dice) {
        setAnimateDice(true);
        setTimeout(() => {
          setAnimateDice(false);
          setTimeout(() => {
            props.updateGame(triggerFirstPlayerTransition(game));
          }, diceTransitionDuration * 1000);
        }, diceTransitionDuration * 1000);
      } else if (game.transitionType === TransitionType.jailDiceRoll) {
        setAnimateDice(true);
        setTimeout(() => {
          setAnimateDice(false);
          setTimeout(() => {
            const player = getCurrentPlayer(game);
            const isDoubles = isDoublesRoll(game.dice);
            const isLastTurnInJail = player.turnsInJail === maxTurnsInJail - 1;

            const nextGame = isDoubles
              ? triggerRollDoublesInJail(game)
              : isLastTurnInJail
              ? triggerLastTurnInJail(game)
              : triggerRemainInJail(game);

            props.updateGame(nextGame);
          }, diceTransitionDuration * 1000);
        }, diceTransitionDuration * 1000);
      }
    }
  }, [props.game]);

  return (
    <div
      style={{
        height: props.isDesktop ? '100vh' : '100vw',
        width: props.isDesktop ? '100vh' : '100vw',
      }}
    >
      <Grid
        {...props}
        gridSize={11}
        rows={{
          bottom: OuterBottomRow,
          left: OuterLeftRow,
          right: OuterRightRow,
          top: OuterTopRow,
        }}
      >
        <Grid
          {...props}
          gridSize={9}
          rows={{
            bottom: InnerBottomRow,
            left: InnerLeftRow,
            right: InnerRightRow,
            top: InnerTopRow,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            <div
              style={{
                fontSize: animateDice ? 48 : undefined,
                marginBottom: 16,
                transition: `font-size ${diceTransitionDuration}s`,
              }}
            >
              {diceSymbol} {diceToString(props.game.dice)}
            </div>
            <div>
              {parkingSymbol} {currencySymbol} {props.game.centerPot}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
