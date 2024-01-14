import React from 'react';
import { Game } from '../types';
import { ChangeComponent } from './change';

interface HistoricalProps {
  game: Game;
}

export const Historical: React.FC<HistoricalProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 18 }}>
      {props.game.changeHistory.map((change, index) => (
        <ChangeComponent change={change} game={props.game} key={index} />
      ))}
    </div>
  );
};
