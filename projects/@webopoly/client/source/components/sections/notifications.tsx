import { Game } from '@webopoly/core';
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { EventComponent } from '../common/event';

interface NotificationsProps {
  clearNotifications: () => void;
  game: Game;
}

export const Notifications: React.FC<NotificationsProps> = (props) => {
  useEffect(() => {
    if (props.game.notifications.length > 0) {
      props.game.notifications.forEach((event) => {
        toast(<EventComponent event={event} game={props.game} />, {
          autoClose: 3000,
        });
      });

      props.clearNotifications();
    }
  }, [props.game.notifications]);

  return <ToastContainer position="top-left" />;
};
