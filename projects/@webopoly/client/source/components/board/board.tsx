import {
  canRollDice,
  diceToString,
  diceTransitionDuration,
  Game,
  GamePhase,
  GameUpdate,
  GameUpdateType,
  Player,
  TransitionType,
} from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { diceSymbol } from '../../parameters';
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
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
  zoom: number;
}

export const Board: React.FC<BoardProps> = (props) => {
  const [animateDice, setAnimateDice] = useState(false);

  const canRoll = canRollDice(props.game, props.windowPlayerId);

  useEffect(() => {
    if (props.game.notifications.length) {
      // Wait for the notifications to be processed before triggering animations
      return;
    }

    if (
      props.game.phase === GamePhase.uiTransition &&
      (props.game.transitionType === TransitionType.dice ||
        props.game.transitionType === TransitionType.jailDiceRoll)
    ) {
      setAnimateDice(true);
      setTimeout(() => {
        setAnimateDice(false);
      }, diceTransitionDuration * 1000);
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
                  if (canRoll) {
                    props.triggerUpdate({ type: GameUpdateType.rollDice });
                  }
                }}
                style={{
                  animation: canRoll
                    ? 'heart-beat 1.5s infinite'
                    : animateDice
                    ? `roll ${diceTransitionDuration}s infinite`
                    : undefined,
                  borderRadius: 15,
                  cursor: canRoll ? 'pointer' : undefined,
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
