import React from 'react';
import { Game } from '../types';
import { GameEventComponent } from './game-event';

interface HistoricalProps {
  game: Game;
}

export const Historical: React.FC<HistoricalProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 18 }}>
      {props.game.events.map((event, index) => (
        <GameEventComponent event={event} game={props.game} key={`${index}`} />
      ))}
    </div>
  );
};
