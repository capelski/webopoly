import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Game } from '../../../../core';
import { EventComponent } from '../common/event';

interface NotificationsProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const Notifications: React.FC<NotificationsProps> = (props) => {
  useEffect(() => {
    if (props.game.notifications.length > 0) {
      props.game.notifications.forEach((event) => {
        toast(<EventComponent event={event} game={props.game} />, {
          autoClose: 3000,
        });
      });

      props.updateGame({
        ...props.game,
        notifications: [],
        eventHistory: [...props.game.notifications.reverse(), ...props.game.eventHistory],
      });
    }
  }, [props.game.notifications]);

  return <ToastContainer position="top-left" />;
};