import React from 'react';
import { GameEvent } from '../types';
import { GameEventComponent } from './game-event';

/* TODO Allow filtering events based on type */

interface HistoricalProps {
  events: GameEvent[];
}

export const Historical: React.FC<HistoricalProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24, paddingTop: 24 }}>
      {props.events.map((event, index) => (
        <GameEventComponent event={event} key={`${index}`} />
      ))}
    </div>
  );
};
