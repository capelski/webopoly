import {
  canRollDice,
  diceToString,
  diceTransitionDuration,
  Game,
  GamePhase,
  GameUpdate,
  GameUpdateType,
  Player,
} from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { diceSymbol } from '../../parameters';
import { Button } from '../common/button';
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
  game: Game<any>;
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
      props.game.phase === GamePhase.diceAnimation ||
      props.game.phase === GamePhase.diceInJailAnimation
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
              fontSize: 32,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              autoClick={GameUpdateType.rollDice}
              defaultAction={props.game.defaultAction}
              disabled={!canRoll}
              onClick={() => {
                props.triggerUpdate({ type: GameUpdateType.rollDice });
              }}
              style={{
                borderRadius: 15,
                fontSize: animateDice ? 48 : 32,
                marginBottom: 8,
                transition: `font-size ${diceTransitionDuration}s`,
              }}
              type="transparent"
            >
              <span
                style={{
                  display: 'inline-block',
                  animation: canRoll
                    ? 'heart-beat 1.5s infinite'
                    : animateDice
                    ? `roll ${diceTransitionDuration}s infinite`
                    : undefined,
                }}
              >
                {diceSymbol}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  animation: canRoll
                    ? 'heart-beat 1.5s infinite'
                    : animateDice
                    ? `roll ${diceTransitionDuration}s infinite`
                    : undefined,
                }}
              >
                {diceSymbol}
              </span>
            </Button>
            {diceToString(props.game.dice)}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
