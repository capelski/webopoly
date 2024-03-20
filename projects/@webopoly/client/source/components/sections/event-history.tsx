import React from 'react';
import { Game } from '../../../../core';
import { EventComponent } from '../common/event';

interface EventHistoryProps {
  game: Game;
}

export const EventHistory: React.FC<EventHistoryProps> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        fontSize: 18,
        overflow: 'scroll',
        padding: 8,
      }}
    >
      {props.game.eventHistory.map((event, index) => (
        <EventComponent event={event} game={props.game} key={index} />
      ))}
    </div>
  );
};
