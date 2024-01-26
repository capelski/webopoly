import React from 'react';
import { Game } from '../types';
import { NotificationComponent } from './common/notification';

interface HistoricalProps {
  game: Game;
}

export const Historical: React.FC<HistoricalProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 18 }}>
      {props.game.pastNotifications.map((notification, index) => (
        <NotificationComponent notification={notification} game={props.game} key={index} />
      ))}
    </div>
  );
};
