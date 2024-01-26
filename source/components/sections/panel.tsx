import React from 'react';
import { Game } from '../../types';
import { NotificationComponent } from '../common/notification';
import { Players } from '../player/players';

interface PanelProps {
  game: Game;
  isDesktop: boolean;
  updateGame: (game: Game | undefined) => void;
}

export const Panel: React.FC<PanelProps> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'scroll',
        width: props.isDesktop ? '50%' : '100%',
      }}
    >
      <div style={{ position: 'sticky', backgroundColor: 'white', top: 0, padding: 8 }}>
        <Players currentPlayerId={props.game.currentPlayerId} players={props.game.players} />
      </div>

      <div style={{ padding: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 18 }}>
          {props.game.pastNotifications.map((notification, index) => (
            <NotificationComponent notification={notification} game={props.game} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
