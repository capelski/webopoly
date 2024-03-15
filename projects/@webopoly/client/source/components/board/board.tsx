import React, { useEffect, useState } from 'react';
import {
  diceToString,
  Game,
  GamePhase,
  getCurrentPlayer,
  isDoublesRoll,
  maxTurnsInJail,
  TransitionType,
  triggerDiceRoll,
  triggerFirstPlayerTransition,
  triggerLastTurnInJail,
  triggerNextPlayerTransition,
  triggerRemainInJail,
  triggerRollDoublesInJail,
} from '../../../../core';
import { diceSymbol, diceTransitionDuration, playerTransitionDuration } from '../../parameters';
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
  isLandscape: boolean;
  updateGame: (game: Game | undefined) => void;
  zoom: number;
}

export const Board: React.FC<BoardProps> = (props) => {
  const [animateDice, setAnimateDice] = useState(false);

  useEffect(() => {
    if (props.game.notifications.length) {
      // Wait for the notifications to be processed before triggering animations
      return;
    }

    // TODO Do not trigger full updates for transitions, as they storm WS
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
      } else if (game.transitionType === TransitionType.getOutOfJail) {
        setTimeout(() => {
          props.updateGame(triggerFirstPlayerTransition(game));
        }, playerTransitionDuration * 1000);
      }
    }
  }, [props.game]);

  return (
    <div
      style={{
        backgroundColor: 'lightcyan',
        height: props.isLandscape ? `${100 * props.zoom}dvh` : `${100 * props.zoom}dvw`,
        width: props.isLandscape ? `${100 * props.zoom}dvh` : `${100 * props.zoom}dvw`,
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
            }}
          >
            <div
              style={{
                fontSize: animateDice ? 48 : 32,
                textAlign: 'center',
                transition: `font-size ${diceTransitionDuration}s`,
              }}
            >
              <div
                onClick={() => {
                  if (props.game.phase === GamePhase.rollDice) {
                    props.updateGame(triggerDiceRoll(props.game));
                  }
                }}
                style={{
                  animation:
                    props.game.phase === GamePhase.rollDice
                      ? 'heart-beat 1.5s infinite'
                      : animateDice
                      ? `roll ${diceTransitionDuration}s infinite`
                      : undefined,
                  borderRadius: 15,
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
              >
                {diceSymbol}
              </div>
              {diceToString(props.game.dice)}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
