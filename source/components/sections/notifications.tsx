import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Game } from '../../types';
import { NotificationComponent } from '../common/notification';

interface NotificationsProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const Notifications: React.FC<NotificationsProps> = (props) => {
  useEffect(() => {
    if (props.game.notifications.length > 0) {
      props.game.notifications.forEach((notification) => {
        toast(<NotificationComponent notification={notification} game={props.game} />, {
          autoClose: 3000,
        });
      });
      props.updateGame({
        ...props.game,
        notifications: [],
        pastNotifications: [...props.game.notifications, ...props.game.pastNotifications],
      });
    }
  }, [props.game.notifications]);

  return <ToastContainer />;
};
