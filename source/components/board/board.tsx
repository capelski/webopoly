import React from 'react';
import { diceToString } from '../../logic';
import { currencySymbol, diceSymbol, parkingSymbol } from '../../parameters';
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
            <div style={{ marginBottom: 16 }}>
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
